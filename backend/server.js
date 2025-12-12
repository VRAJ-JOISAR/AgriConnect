const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - removed deprecated options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/students', require('./routes/students'));
app.use('/api/progress', require('./routes/progress'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'AgriConnect Backend is running!', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});