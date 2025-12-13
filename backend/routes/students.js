const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');
const { validateProfile } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/students
// @desc    Get all students (for teachers/admins)
// @access  Private (Teachers/Admins)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'error',
        message: 'Not authorized' 
      });
    }

    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('enrolledCourses', 'title category');

    res.json({
      status: 'success',
      data: { students }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// @route   GET /api/students/stats
// @desc    Get student statistics
// @access  Private (Admin)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'error',
        message: 'Not authorized' 
      });
    }

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await User.aggregate([
      { $match: { role: 'student' } },
      { $project: { enrolledCount: { $size: '$enrolledCourses' } } },
      { $group: { _id: null, total: { $sum: '$enrolledCount' } } }
    ]);

    // Active students (students with activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeStudents = await Progress.distinct('student', {
      lastActivity: { $gte: sevenDaysAgo }
    });

    // Course completion rates
    const completionStats = await Progress.aggregate([
      { $group: { 
        _id: null, 
        avgProgress: { $avg: '$overallProgress' },
        completedCourses: { $sum: { $cond: [{ $gte: ['$overallProgress', 100] }, 1, 0] } }
      }}
    ]);

    res.json({
      status: 'success',
      data: {
        totalStudents,
        totalCourses,
        totalEnrollments: totalEnrollments[0]?.total || 0,
        activeStudents: activeStudents.length,
        averageProgress: completionStats[0]?.avgProgress || 0,
        completedCourses: completionStats[0]?.completedCourses || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// @route   GET /api/students/leaderboard
// @desc    Get top performing students
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const topStudents = await Progress.aggregate([
      {
        $group: {
          _id: '$student',
          averageProgress: { $avg: '$overallProgress' },
          totalBadges: { $sum: { $size: '$badges' } },
          coursesCompleted: { $sum: { $cond: [{ $gte: ['$overallProgress', 100] }, 1, 0] } }
        }
      },
      { $sort: { averageProgress: -1, totalBadges: -1 } },
      { $limit: 10 },
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
          name: '$student.name',
          email: '$student.email',
          avatar: '$student.avatar',
          averageProgress: 1,
          totalBadges: 1,
          coursesCompleted: 1
        }
      }
    ]);

    res.json({
      status: 'success',
      data: { leaderboard: topStudents }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Students can only view their own profile, teachers/admins can view any
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Not authorized' 
      });
    }

    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title category difficulty');

    if (!student) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Student not found' 
      });
    }

    // Get student's progress across all courses
    const progress = await Progress.find({ student: req.params.id })
      .populate('course', 'title category');

    res.json({
      status: 'success',
      data: {
        student,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// @route   PUT /api/students/:id/profile
// @desc    Update student profile
// @access  Private (Own profile only)
router.put('/:id/profile', auth, validateProfile, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Not authorized to update this profile' 
      });
    }

    const { name, profile } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, profile },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

module.exports = router;