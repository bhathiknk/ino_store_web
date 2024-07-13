const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAdminDetails } = require('../controllers/adminDetailsController');

// Route to get admin details
router.get('/details', protect, getAdminDetails);

module.exports = router;
