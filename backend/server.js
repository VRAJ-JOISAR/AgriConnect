const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Continuing without database...');
  }
};

connectDB();

// Health check endpoint (works without database)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'AgriConnect Backend API is running!',
    timestamp: new Date(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AgriConnect API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health - Health check',
      docs: '/api - API documentation'
    }
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'AgriConnect Backend Server',
    status: 'running',
    api: `/api`,
    health: `/api/health`
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error.message);
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
});

// Start server with proper error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 AgriConnect Backend Server Started`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    const altPort = PORT + 1;
    console.log(`🔄 Trying port ${altPort}...`);
    app.listen(altPort, () => {
      console.log(`🚀 AgriConnect Backend Server Started on alternate port`);
      console.log(`📍 Running on: http://localhost:${altPort}`);
      console.log(`🌐 API: http://localhost:${altPort}/api`);
      console.log(`💚 Health: http://localhost:${altPort}/api/health`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
});