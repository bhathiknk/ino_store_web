const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./utils/errorHandler');
const path = require('path');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Serve static files for image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
