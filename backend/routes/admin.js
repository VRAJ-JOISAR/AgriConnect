const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { adminOnly } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/admin/system-stats
// @desc    Get comprehensive system statistics
// @access  Private (Admin only)
router.get('/system-stats', adminOnly, async (req, res) => {
  try {
    const [
      userStats,
      courseStats,
      progressStats,
      recentUsers,
      topCourses
    ] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Course statistics
      Course.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: { $sum: { $cond: ['$isPublished', 1, 0] } },
            totalLessons: { $sum: { $size: '$lessons' } },
            totalQuizzes: { $sum: { $size: '$quizzes' } }
          }
        }
      ]),
      
      // Progress statistics
      Progress.aggregate([
        {
          $group: {
            _id: null,
            totalProgress: { $sum: 1 },
            avgProgress: { $avg: '$overallProgress' },
            completedCourses: { $sum: { $cond: [{ $gte: ['$overallProgress', 100] }, 1, 0] } },
            totalBadges: { $sum: { $size: '$badges' } }
          }
        }
      ]),
      
      // Recent users (last 7 days)
      User.find({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).select('name email role createdAt').sort({ createdAt: -1 }).limit(10),
      
      // Top courses by enrollment
      Course.aggregate([
        {
          $project: {
            title: 1,
            category: 1,
            enrollmentCount: { $size: '$enrolledStudents' }
          }
        },
        { $sort: { enrollmentCount: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Format user stats
    const formattedUserStats = {
      total: 0,
      students: 0,
      teachers: 0,
      admins: 0
    };

    userStats.forEach(stat => {
      formattedUserStats.total += stat.count;
      formattedUserStats[stat._id + 's'] = stat.count;
    });

    res.json({
      status: 'success',
      data: {
        users: formattedUserStats,
        courses: courseStats[0] || { total: 0, published: 0, totalLessons: 0, totalQuizzes: 0 },
        progress: progressStats[0] || { totalProgress: 0, avgProgress: 0, completedCourses: 0, totalBadges: 0 },
        recentUsers,
        topCourses
      }
    });
  } catch (error) {
    console.error('System stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch system statistics'
    });
  }
});

// @route   GET /api/admin/users/analytics
// @desc    Get detailed user analytics
// @access  Private (Admin only)
router.get('/users/analytics', adminOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // User registration trends
    const registrationTrends = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Active users (users with recent activity)
    const activeUsers = await Progress.aggregate([
      { $match: { lastActivity: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastActivity' } },
          uniqueUsers: { $addToSet: '$student' }
        }
      },
      {
        $project: {
          _id: 1,
          activeCount: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User engagement metrics
    const engagementMetrics = await User.aggregate([
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'student',
          as: 'progress'
        }
      },
      {
        $project: {
          role: 1,
          enrolledCourses: { $size: '$enrolledCourses' },
          averageProgress: { $avg: '$progress.overallProgress' },
          totalBadges: { $sum: { $sum: { $map: { input: '$progress', as: 'p', in: { $size: '$$p.badges' } } } } }
        }
      },
      {
        $group: {
          _id: '$role',
          avgEnrollments: { $avg: '$enrolledCourses' },
          avgProgress: { $avg: '$averageProgress' },
          avgBadges: { $avg: '$totalBadges' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        registrationTrends,
        activeUsers,
        engagementMetrics
      }
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user analytics'
    });
  }
});

// @route   POST /api/admin/courses/bulk-action
// @desc    Perform bulk actions on courses
// @access  Private (Admin only)
router.post('/courses/bulk-action', adminOnly, async (req, res) => {
  try {
    const { action, courseIds } = req.body;

    if (!action || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid action or course IDs'
      });
    }

    let result;
    switch (action) {
      case 'publish':
        result = await Course.updateMany(
          { _id: { $in: courseIds } },
          { isPublished: true }
        );
        break;
      
      case 'unpublish':
        result = await Course.updateMany(
          { _id: { $in: courseIds } },
          { isPublished: false }
        );
        break;
      
      case 'delete':
        // Remove courses from user enrollments
        await User.updateMany(
          { enrolledCourses: { $in: courseIds } },
          { $pullAll: { enrolledCourses: courseIds } }
        );
        
        // Delete progress records
        await Progress.deleteMany({ course: { $in: courseIds } });
        
        // Delete courses
        result = await Course.deleteMany({ _id: { $in: courseIds } });
        break;
      
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid action'
        });
    }

    res.json({
      status: 'success',
      message: `Bulk ${action} completed successfully`,
      data: { affected: result.modifiedCount || result.deletedCount }
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to perform bulk action'
    });
  }
});

// @route   GET /api/admin/reports/engagement
// @desc    Get user engagement report
// @access  Private (Admin only)
router.get('/reports/engagement', adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // User engagement by role
    const roleEngagement = await User.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'student',
          as: 'progress'
        }
      },
      {
        $group: {
          _id: '$role',
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$progress' }, 0] }, 1, 0]
            }
          },
          avgCoursesEnrolled: { $avg: { $size: '$enrolledCourses' } },
          avgProgress: {
            $avg: {
              $avg: '$progress.overallProgress'
            }
          }
        }
      }
    ]);

    // Course completion rates by category
    const categoryCompletion = await Course.aggregate([
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'course',
          as: 'progress'
        }
      },
      {
        $group: {
          _id: '$category',
          totalCourses: { $sum: 1 },
          totalEnrollments: { $sum: { $size: '$enrolledStudents' } },
          completions: {
            $sum: {
              $size: {
                $filter: {
                  input: '$progress',
                  cond: { $gte: ['$$this.overallProgress', 100] }
                }
              }
            }
          },
          avgProgress: { $avg: { $avg: '$progress.overallProgress' } }
        }
      },
      {
        $project: {
          _id: 1,
          totalCourses: 1,
          totalEnrollments: 1,
          completions: 1,
          avgProgress: { $round: ['$avgProgress', 2] },
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ['$completions', '$totalEnrollments'] }, 100] },
              2
            ]
          }
        }
      }
    ]);

    // Most active students
    const topStudents = await Progress.aggregate([
      {
        $group: {
          _id: '$student',
          totalCourses: { $sum: 1 },
          avgProgress: { $avg: '$overallProgress' },
          totalBadges: { $sum: { $size: '$badges' } },
          lastActivity: { $max: '$lastActivity' }
        }
      },
      { $sort: { avgProgress: -1, totalBadges: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalCourses: 1,
          avgProgress: { $round: ['$avgProgress', 1] },
          totalBadges: 1,
          lastActivity: 1
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        roleEngagement,
        categoryCompletion,
        topStudents
      }
    });
  } catch (error) {
    console.error('Engagement report error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate engagement report'
    });
  }
});

// @route   POST /api/admin/system/maintenance
// @desc    Perform system maintenance tasks
// @access  Private (Admin only)
router.post('/system/maintenance', adminOnly, async (req, res) => {
  try {
    const { task } = req.body;
    let result = {};

    switch (task) {
      case 'cleanup-orphaned-progress':
        // Remove progress records for deleted courses or users
        const orphanedProgress = await Progress.aggregate([
          {
            $lookup: {
              from: 'courses',
              localField: 'course',
              foreignField: '_id',
              as: 'courseExists'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'student',
              foreignField: '_id',
              as: 'userExists'
            }
          },
          {
            $match: {
              $or: [
                { courseExists: { $size: 0 } },
                { userExists: { $size: 0 } }
              ]
            }
          }
        ]);
        
        if (orphanedProgress.length > 0) {
          await Progress.deleteMany({
            _id: { $in: orphanedProgress.map(p => p._id) }
          });
        }
        
        result.cleanedProgressRecords = orphanedProgress.length;
        break;

      case 'update-course-stats':
        // Recalculate course enrollment counts
        const courses = await Course.find();
        for (const course of courses) {
          const actualEnrollments = await User.countDocuments({
            enrolledCourses: course._id
          });
          course.enrolledStudents = await User.find({
            enrolledCourses: course._id
          }).select('_id');
          await course.save();
        }
        result.updatedCourses = courses.length;
        break;

      case 'recalculate-progress':
        // Recalculate all progress percentages
        const allProgress = await Progress.find().populate('course');
        let updated = 0;
        
        for (const progress of allProgress) {
          if (progress.course && progress.course.lessons.length > 0) {
            const completedLessons = progress.lessonsCompleted.length;
            const totalLessons = progress.course.lessons.length;
            const newProgress = Math.round((completedLessons / totalLessons) * 100);
            
            if (newProgress !== progress.overallProgress) {
              progress.overallProgress = newProgress;
              await progress.save();
              updated++;
            }
          }
        }
        
        result.updatedProgressRecords = updated;
        break;

      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid maintenance task'
        });
    }

    res.json({
      status: 'success',
      message: `Maintenance task '${task}' completed successfully`,
      data: result
    });
  } catch (error) {
    console.error('Maintenance task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to perform maintenance task'
    });
  }
});

module.exports = router;