const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};




const validateRegister = async (req, res, next) => {
  await body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .run(req);

  await body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .run(req);

  await body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .run(req);

  await body('role')
    .optional()
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be student, teacher, or admin')
    .run(req);

  handleValidationErrors(req, res, next);
};

// User login validation
const validateLogin = async (req, res, next) => {
  await body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .run(req);

  await body('password')
    .notEmpty()
    .withMessage('Password is required')
    .run(req);

  handleValidationErrors(req, res, next);
};

// Course creation validation
const validateCourse = async (req, res, next) => {
  await body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Course title must be between 3 and 100 characters')
    .run(req);

  await body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Course description must be between 10 and 1000 characters')
    .run(req);

  await body('category')
    .isIn(['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science'])
    .withMessage('Invalid course category')
    .run(req);

  await body('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced')
    .run(req);

  handleValidationErrors(req, res, next);
};

// User profile update validation
const validateProfile = async (req, res, next) => {
  await body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .run(req);

  handleValidationErrors(req, res, next);
};

// Quiz submission validation
const validateQuizSubmission = async (req, res, next) => {
  await body('courseId')
    .isMongoId()
    .withMessage('Invalid course ID')
    .run(req);

  await body('quizId')
    .isMongoId()
    .withMessage('Invalid quiz ID')
    .run(req);

  await body('answers')
    .isArray()
    .withMessage('Answers must be an array')
    .run(req);

  handleValidationErrors(req, res, next);
};

// Lesson completion validation
const validateLessonCompletion = async (req, res, next) => {
  await body('courseId')
    .isMongoId()
    .withMessage('Invalid course ID')
    .run(req);

  await body('lessonId')
    .isMongoId()
    .withMessage('Invalid lesson ID')
    .run(req);

  await body('timeSpent')
    .optional()
    .isNumeric()
    .withMessage('Time spent must be a number')
    .run(req);

  handleValidationErrors(req, res, next);
};

// Password change validation
const validatePasswordChange = async (req, res, next) => {
  await body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .run(req);

  await body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .run(req);

  await body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
    .run(req);

  handleValidationErrors(req, res, next);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse,
  validateProfile,
  validateQuizSubmission,
  validateLessonCompletion,
  validatePasswordChange,
  handleValidationErrors
};