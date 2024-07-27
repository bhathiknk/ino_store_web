const express = require('express');
const { createOrder, getOrdersBySeller } = require('../controllers/orderController');
const { protect: protectUser } = require('../middlewares/userAuthMiddleware');
const { updateOrderStatus } = require('../controllers/orderController');
const { protect: protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protectUser, createOrder);
router.get('/seller', protectAdmin, getOrdersBySeller);
router.put('/update-status', updateOrderStatus);

module.exports = router;
