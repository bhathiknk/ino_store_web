const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    const { products, paymentMethod, totalAmount } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const buyerId = req.user._id;

    try {
        const productDetails = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }
                return {
                    product: product._id,
                    quantity: item.quantity,
                };
            })
        );

        const order = new Order({
            buyer: buyerId,
            products: productDetails,
            totalAmount,
            paymentMethod,
            isPaid: true, // Assuming payment is completed
            paidAt: Date.now(),
        });

        const savedOrder = await order.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersBySeller = async (req, res) => {
    const sellerId = req.admin._id;

    try {
        const products = await Product.find({ admin: sellerId }).select('_id');
        const productIds = products.map(product => product._id);

        const orders = await Order.find({ 'products.product': { $in: productIds } })
            .populate('products.product', 'name price')
            .populate('buyer', 'name email');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
