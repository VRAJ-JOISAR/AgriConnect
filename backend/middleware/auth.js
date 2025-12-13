const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Enhanced authentication middleware
const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'No token provided, authorization denied' 
      });
    }

    // Remove Bearer prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token is not valid - user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ 
      status: 'error',
      message: 'Token is not valid' 
    });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id).select('-password');
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without user context if token is invalid
    next();
  }
};

// Admin only access
const adminOnly = [auth, authorize('admin')];

// Teacher or Admin access
const teacherOrAdmin = [auth, authorize('teacher', 'admin')];

// Student access (authenticated users)
const studentAccess = [auth, authorize('student', 'teacher', 'admin')];

module.exports = {
  auth,
  authorize,
  optionalAuth,
  adminOnly,
  teacherOrAdmin,
  studentAccess
};