const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth, adminOnly, teacherOrAdmin } = require('../middleware/auth');
const { validateProfile } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('enrolledCourses', 'title category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Admin or own profile)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or accessing own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title category difficulty instructor');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's progress data
    const progressData = await Progress.find({ student: req.params.id })
      .populate('course', 'title category');

    res.json({
      status: 'success',
      data: {
        user,
        progress: progressData
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
});

// @route   PUT /api/users/:id/profile
// @desc    Update user profile
// @access  Private (Own profile or Admin)
router.put('/:id/profile', auth, validateProfile, async (req, res) => {
  try {
    // Check if user is admin or updating own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const updateData = { ...req.body };
    delete updateData.password; // Prevent password updates through this route
    delete updateData.role; // Prevent role changes through this route

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put('/:id/role', adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Remove user from all courses
    await Course.updateMany(
      { enrolledStudents: req.params.id },
      { $pull: { enrolledStudents: req.params.id } }
    );

    // Delete user's progress records
    await Progress.deleteMany({ student: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
});

// @route   GET /api/users/:id/courses
// @desc    Get user's enrolled courses
// @access  Private (Own courses or Admin)
router.get('/:id/courses', auth, async (req, res) => {
  try {
    // Check if user is admin or accessing own courses
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const progress = await Progress.findOne({
          student: req.params.id,
          course: course._id
        });
        
        return {
          ...course.toObject(),
          progress: progress ? progress.overallProgress : 0,
          lastActivity: progress ? progress.lastActivity : null
        };
      })
    );

    res.json({
      status: 'success',
      data: { courses: coursesWithProgress }
    });
  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user courses'
    });
  }
});

// @route   POST /api/users/:id/avatar
// @desc    Upload user avatar
// @access  Private (Own profile or Admin)
router.post('/:id/avatar', auth, async (req, res) => {
  try {
    // Check if user is admin or updating own avatar
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        status: 'error',
        message: 'Avatar URL is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Avatar updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update avatar'
    });
  }
});

module.exports = router;