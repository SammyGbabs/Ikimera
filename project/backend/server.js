const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const historyRoutes = require('./routes/history');
const weatherRoutes = require('./routes/weather');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Ikimera API is running!' });
});

app.listen(PORT, () => {
  console.log(`Ikimera server running on port ${PORT}`);
});

module.exports = app;