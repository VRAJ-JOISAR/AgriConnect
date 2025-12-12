const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonsCompleted: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    timeSpent: Number // in minutes
  }],
  quizzesCompleted: [{
    quizId: mongoose.Schema.Types.ObjectId,
    score: Number,
    completedAt: Date,
    answers: [Number]
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  badges: [{
    type: String,
    earnedAt: Date
  }],
  streakCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for student-course combination
progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);