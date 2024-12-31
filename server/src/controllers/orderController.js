const Order = require('../models/Order');
const Product = require('../models/Product');
const paypal = require('paypal-rest-sdk');
const Notification = require('../models/Notification');
require('dotenv').config();


// Configure PayPal SDK with environment variables
paypal.configure({
    mode: process.env.PAYPAL_MODE, // 'sandbox' or 'live'
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

exports.createOrder = async (req, res) => {
    const { products, paymentMethod, shippingDetails, paymentId, payerId } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const buyerId = req.user._id;

    try {
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products in the order' });
        }

        const sellerOrders = {};

        await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product).populate('admin');
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }

                const sellerId = product.admin._id;
                const price = product.discountPrice || product.basePrice;

                if (!sellerOrders[sellerId]) {
                    sellerOrders[sellerId] = {
                        buyer: buyerId,
                        products: [],
                        totalAmount: 0,
                        paymentMethod,
                        isPaid: true,
                        paidAt: Date.now(),
                        paymentId,
                        payerId,
                        shippingDetails,
                        orderStatus: 'Processing',
                    };
                }

                sellerOrders[sellerId].products.push({
                    product: product._id,
                    quantity: item.quantity,
                });

                sellerOrders[sellerId].totalAmount += item.quantity * price;
            })
        );

        const savedOrders = [];
        for (const sellerId in sellerOrders) {
            const order = new Order({
                ...sellerOrders[sellerId],
                buyer: buyerId,
                totalAmount: sellerOrders[sellerId].totalAmount,
            });

            const savedOrder = await order.save();
            savedOrders.push(savedOrder);

            // Save notification
            await Notification.create({
                message: 'A new order has been placed!',
                recipient: sellerId,
            });

        }

        // Emit WebSocket event to notify the seller
        const io = req.app.get('socketio');
        io.emit('orderCreated', {
            message: 'A new order has been placed!',
            orders: savedOrders,
        });

        res.status(201).json(savedOrders);
    } catch (error) {
        console.error("Order Creation Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};



// Example getOrdersBySeller controller fix
exports.getOrdersBySeller = async (req, res) => {
    try {
        const adminId = req.admin?._id; // Safely check for admin._id
        if (!adminId) {
            return res.status(401).json({ message: 'Not authorized as admin' });
        }

        const orders = await Order.find({
            'products.product': { $in: await Product.find({ admin: adminId }).select('_id') },
        }).populate('products.product');

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders by seller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// controllers/orderController.js
exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrdersByUser = async (req, res) => {
    try {

        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        const orders = await Order.find({ buyer: userId }).populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders by user:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};



