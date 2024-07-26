const express = require('express');
const router = express.Router();
const { getSalesSummary } = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/summary', protect, getSalesSummary);

module.exports = router;
