const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profile')
      .populate('enrolledStudents', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Teachers/Admins)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create courses' });
    }

    const courseData = { ...req.body, instructor: req.user._id };
    const course = await Course.create(courseData);

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Course instructor or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is course instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email');

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to course
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Add course to user's enrolled courses
    user.enrolledCourses.push(course._id);
    await user.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/courses/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my/courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: {
        path: 'instructor',
        select: 'name email'
      }
    });

    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;