const express = require('express');
const cors = require('cors');
const http = require('http'); // For creating an HTTP server
const { Server } = require('socket.io'); // Import Socket.IO
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminDetailsRoutes = require('./routes/adminDetailsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/UserAddress');
const salesRoutes = require('./routes/salesRoutes');
const errorHandler = require('./utils/errorHandler');
const path = require('path');

// Initialize express
const app = express();

// Create HTTP server for WebSocket integration
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (e.g., image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Define API routes
app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminDetailsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userAuthRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/sales', salesRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Example event listeners (customize as needed)
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Attach the Socket.IO instance to the Express app
app.set('socketio', io);

// Error handling middleware
app.use(errorHandler);

// Export the Express app and HTTP server
module.exports = { app, server };
