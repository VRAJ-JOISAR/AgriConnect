const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth, adminOnly, teacherOrAdmin } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview statistics
// @access  Private (Admin/Teacher)
router.get('/overview', teacherOrAdmin, async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      activeStudents
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      User.aggregate([
        { $match: { role: 'student' } },
        { $project: { enrolledCount: { $size: '$enrolledCourses' } } },
        { $group: { _id: null, total: { $sum: '$enrolledCount' } } }
      ]),
      Progress.distinct('student', {
        lastActivity: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    // Course completion stats
    const completionStats = await Progress.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$overallProgress' },
          completedCourses: { $sum: { $cond: [{ $gte: ['$overallProgress', 100] }, 1, 0] } }
        }
      }
    ]);

    // Recent enrollments (last 30 days)
    const recentEnrollments = await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalStudents,
          totalTeachers,
          totalCourses,
          publishedCourses,
          totalEnrollments: totalEnrollments[0]?.total || 0,
          activeStudents: activeStudents.length,
          averageProgress: completionStats[0]?.avgProgress || 0,
          completedCourses: completionStats[0]?.completedCourses || 0
        },
        charts: {
          recentEnrollments
        }
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard overview'
    });
  }
});

// @route   GET /api/dashboard/student/:id
// @desc    Get student dashboard data
// @access  Private (Own dashboard or Admin/Teacher)
router.get('/student/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    if (req.user.role === 'student' && req.user._id.toString() !== id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const student = await User.findById(id).populate('enrolledCourses', 'title category');
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Get progress data
    const progressData = await Progress.find({ student: id })
      .populate('course', 'title category thumbnail');

    // Calculate dashboard metrics
    const totalCourses = progressData.length;
    const completedCourses = progressData.filter(p => p.overallProgress === 100).length;
    const averageProgress = totalCourses > 0 
      ? Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / totalCourses)
      : 0;
    
    const totalBadges = progressData.reduce((sum, p) => sum + p.badges.length, 0);
    const currentStreak = Math.max(...progressData.map(p => p.streakCount), 0);
    const totalQuizzes = progressData.reduce((sum, p) => sum + p.quizzesCompleted.length, 0);
    const totalLessons = progressData.reduce((sum, p) => sum + p.lessonsCompleted.length, 0);

    // Recent activity
    const recentActivity = progressData
      .filter(p => p.lastActivity)
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
      .slice(0, 10);

    // Progress by category
    const categoryProgress = await Progress.aggregate([
      { $match: { student: student._id } },
      { 
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$courseInfo.category',
          averageProgress: { $avg: '$overallProgress' },
          courseCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          profile: student.profile
        },
        summary: {
          totalCourses,
          completedCourses,
          averageProgress,
          totalBadges,
          currentStreak,
          totalQuizzes,
          totalLessons
        },
        courses: progressData,
        recentActivity,
        categoryProgress
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch student dashboard'
    });
  }
});

// @route   GET /api/dashboard/course/:id
// @desc    Get course analytics
// @access  Private (Course instructor or Admin)
router.get('/course/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email avatar');

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && course.instructor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Get course progress data
    const progressData = await Progress.find({ course: req.params.id })
      .populate('student', 'name email avatar');

    // Calculate analytics
    const totalStudents = course.enrolledStudents.length;
    const studentsWithProgress = progressData.length;
    const completedStudents = progressData.filter(p => p.overallProgress === 100).length;
    const averageProgress = studentsWithProgress > 0
      ? Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / studentsWithProgress)
      : 0;

    // Lesson completion rates
    const lessonCompletionRates = course.lessons.map((lesson, index) => {
      const completedCount = progressData.filter(p => 
        p.lessonsCompleted.some(l => l.lessonId.toString() === lesson._id.toString())
      ).length;
      
      return {
        lessonIndex: index,
        lessonTitle: lesson.title,
        completionRate: totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0,
        completedCount
      };
    });

    // Quiz performance
    const quizPerformance = course.quizzes.map((quiz, index) => {
      const quizAttempts = progressData
        .flatMap(p => p.quizzesCompleted.filter(q => q.quizId.toString() === quiz._id.toString()));
      
      const averageScore = quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
        : 0;

      return {
        quizIndex: index,
        quizTitle: quiz.title,
        attempts: quizAttempts.length,
        averageScore,
        passRate: Math.round((quizAttempts.filter(q => q.score >= 70).length / Math.max(quizAttempts.length, 1)) * 100)
      };
    });

    res.json({
      status: 'success',
      data: {
        course: {
          _id: course._id,
          title: course.title,
          category: course.category,
          difficulty: course.difficulty,
          instructor: course.instructor
        },
        analytics: {
          totalStudents,
          studentsWithProgress,
          completedStudents,
          averageProgress,
          completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0
        },
        lessonCompletionRates,
        quizPerformance,
        students: progressData.map(p => ({
          student: p.student,
          progress: p.overallProgress,
          lastActivity: p.lastActivity,
          badges: p.badges.length,
          streakCount: p.streakCount
        }))
      }
    });
  } catch (error) {
    console.error('Course analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch course analytics'
    });
  }
});

// @route   GET /api/dashboard/leaderboard
// @desc    Get student leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    let matchStage = {};
    if (category) {
      const categoryFilter = await Course.find({ category }).select('_id');
      matchStage.course = { $in: categoryFilter.map(c => c._id) };
    }

    const leaderboard = await Progress.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$student',
          averageProgress: { $avg: '$overallProgress' },
          totalBadges: { $sum: { $size: '$badges' } },
          coursesCompleted: { $sum: { $cond: [{ $gte: ['$overallProgress', 100] }, 1, 0] } },
          totalCourses: { $sum: 1 },
          maxStreak: { $max: '$streakCount' }
        }
      },
      { $sort: { averageProgress: -1, totalBadges: -1, coursesCompleted: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: '$student._id',
          name: '$student.name',
          email: '$student.email',
          avatar: '$student.avatar',
          averageProgress: { $round: ['$averageProgress', 1] },
          totalBadges: 1,
          coursesCompleted: 1,
          totalCourses: 1,
          maxStreak: 1,
          score: {
            $add: [
              { $multiply: ['$averageProgress', 0.4] },
              { $multiply: ['$totalBadges', 10] },
              { $multiply: ['$coursesCompleted', 20] }
            ]
          }
        }
      },
      { $sort: { score: -1 } }
    ]);

    res.json({
      status: 'success',
      data: { leaderboard }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch leaderboard'
    });
  }
});

module.exports = router;