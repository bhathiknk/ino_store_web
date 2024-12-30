const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const { protect: protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protectAdmin, getNotifications);

module.exports = router;
