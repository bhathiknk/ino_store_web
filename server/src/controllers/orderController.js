const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    const { products, paymentMethod, shippingDetails } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const buyerId = req.user._id;

    try {
        // Step 1: Fetch product details and group by seller
        const sellerOrders = {};

        await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product).populate('admin');
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }

                const sellerId = product.admin._id;

                // Determine the correct price to use
                const price = product.discountPrice || product.basePrice;

                if (!sellerOrders[sellerId]) {
                    sellerOrders[sellerId] = {
                        buyer: buyerId,
                        products: [],
                        totalAmount: 0,
                        paymentMethod,
                        isPaid: true,
                        paidAt: Date.now(),
                        shippingDetails,
                        orderStatus: 'Processing',
                    };
                }

                // Add product to the seller's order
                sellerOrders[sellerId].products.push({
                    product: product._id,
                    quantity: item.quantity,
                });

                // Update the total amount using the determined price
                sellerOrders[sellerId].totalAmount += item.quantity * price;
            })
        );

        // Step 2: Create and save orders for each seller
        const savedOrders = [];
        for (const sellerId in sellerOrders) {
            const order = new Order({
                ...sellerOrders[sellerId],
                buyer: buyerId,
                totalAmount: sellerOrders[sellerId].totalAmount,
            });

            const savedOrder = await order.save();
            savedOrders.push(savedOrder);
        }

        res.status(201).json(savedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrdersBySeller = async (req, res) => {
    const adminId = req.admin._id;

    try {
        const products = await Product.find({ admin: adminId }).select('_id');
        const productIds = products.map(product => product._id);

        const orders = await Order.find({ 'products.product': { $in: productIds } })
            .populate('products.product', 'name images') // Include image field
            .populate('buyer', 'name email');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
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


