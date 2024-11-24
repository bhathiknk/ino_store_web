const express = require('express');
const {
    approveAdmin,
    getPendingAdmins,
    rejectAdmin,
} = require('../controllers/handlerController');
const { protect } = require('../middlewares/userAuthMiddleware');

const router = express.Router();

// Approve or reject an admin signup
router.put('/approve/:id', protect, approveAdmin);

// Get all pending admin signup requests
router.get('/pending', protect, getPendingAdmins);

// Reject an admin signup request
router.delete('/reject/:id', protect, rejectAdmin);

module.exports = router;
