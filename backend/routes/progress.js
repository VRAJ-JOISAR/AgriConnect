const express = require('express');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');
const { validateQuizSubmission, validateLessonCompletion } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/progress/:studentId/:courseId
// @desc    Get student progress for a specific course
// @access  Private
router.get('/:studentId/:courseId', auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Students can only view their own progress
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    let progress = await Progress.findOne({ 
      student: studentId, 
      course: courseId 
    }).populate('course', 'title lessons quizzes');

    if (!progress) {
      // Create initial progress record if it doesn't exist
      progress = await Progress.create({
        student: studentId,
        course: courseId,
        overallProgress: 0
      });
      await progress.populate('course', 'title lessons quizzes');
    }

    res.json({
      status: 'success',
      data: { progress }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   POST /api/progress/complete-lesson
// @desc    Mark lesson as completed
// @access  Private
router.post('/complete-lesson', auth, validateLessonCompletion, async (req, res) => {
  try {
    const { courseId, lessonId, timeSpent } = req.body;
    const studentId = req.user._id;

    let progress = await Progress.findOne({ 
      student: studentId, 
      course: courseId 
    });

    if (!progress) {
      progress = await Progress.create({
        student: studentId,
        course: courseId
      });
    }

    // Check if lesson already completed
    const existingLesson = progress.lessonsCompleted.find(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (!existingLesson) {
      progress.lessonsCompleted.push({
        lessonId,
        completedAt: new Date(),
        timeSpent: timeSpent || 0
      });
    }

    // Update overall progress
    const course = await Course.findById(courseId);
    const totalLessons = course.lessons.length;
    const completedLessons = progress.lessonsCompleted.length;
    progress.overallProgress = Math.round((completedLessons / totalLessons) * 100);

    // Update last activity
    progress.lastActivity = new Date();

    // Award badges
    if (progress.overallProgress === 100 && !progress.badges.some(b => b.type === 'Course Completed')) {
      progress.badges.push({
        type: 'Course Completed',
        earnedAt: new Date()
      });
    }

    await progress.save();

    res.json({
      status: 'success',
      message: 'Lesson marked as completed',
      data: { progress }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   POST /api/progress/complete-quiz
// @desc    Submit quiz and record score
// @access  Private
router.post('/complete-quiz', auth, validateQuizSubmission, async (req, res) => {
  try {
    const { courseId, quizId, answers } = req.body;
    const studentId = req.user._id;

    // Get course and quiz details
    const course = await Course.findById(courseId);
    const quiz = course.quizzes.id(quizId);

    if (!quiz) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    let progress = await Progress.findOne({ 
      student: studentId, 
      course: courseId 
    });

    if (!progress) {
      progress = await Progress.create({
        student: studentId,
        course: courseId
      });
    }

    // Record quiz completion
    progress.quizzesCompleted.push({
      quizId,
      score,
      completedAt: new Date(),
      answers
    });

    // Update streak count
    if (score >= 80) {
      progress.streakCount += 1;
    } else {
      progress.streakCount = 0;
    }

    // Award badges based on performance
    if (score === 100 && !progress.badges.some(b => b.type === 'Perfect Score')) {
      progress.badges.push({
        type: 'Perfect Score',
        earnedAt: new Date()
      });
    }

    if (progress.streakCount >= 5 && !progress.badges.some(b => b.type === 'On Fire')) {
      progress.badges.push({
        type: 'On Fire',
        earnedAt: new Date()
      });
    }

    progress.lastActivity = new Date();
    await progress.save();

    res.json({
      status: 'success',
      message: 'Quiz completed successfully',
      data: {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
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

// @route   GET /api/progress/dashboard/:studentId
// @desc    Get student dashboard data
// @access  Private
router.get('/dashboard/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Students can only view their own dashboard
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    const progressData = await Progress.find({ student: studentId })
      .populate('course', 'title category thumbnail');

    // Calculate summary statistics
    const totalCourses = progressData.length;
    const completedCourses = progressData.filter(p => p.overallProgress === 100).length;
    const averageProgress = totalCourses > 0 
      ? Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / totalCourses)
      : 0;
    
    const totalBadges = progressData.reduce((sum, p) => sum + p.badges.length, 0);
    const currentStreak = Math.max(...progressData.map(p => p.streakCount), 0);

    // Recent activity
    const recentActivity = progressData
      .filter(p => p.lastActivity)
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
      .slice(0, 5);

    res.json({
      status: 'success',
      data: {
        summary: {
          totalCourses,
          completedCourses,
          averageProgress,
          totalBadges,
          currentStreak
        },
        courses: progressData,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;