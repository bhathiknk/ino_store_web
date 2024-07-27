// routes/orderRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware'); // Protect route
const { getSalesSummary } = require('../controllers/salesController');

const router = express.Router();

router.get('/sales-summary', protect, getSalesSummary);

module.exports = router;
