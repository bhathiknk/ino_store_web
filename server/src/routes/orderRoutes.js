const express = require('express');
const { createOrder, getOrdersBySeller,getOrdersByUser } = require('../controllers/orderController');
const { protect: protectUser } = require('../middlewares/userAuthMiddleware');
const { updateOrderStatus } = require('../controllers/orderController');
const { protect: protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protectUser, createOrder);
router.get('/seller', protectAdmin, getOrdersBySeller);
router.get('/user', protectUser, getOrdersByUser);
router.put('/update-status', updateOrderStatus);

module.exports = router;
