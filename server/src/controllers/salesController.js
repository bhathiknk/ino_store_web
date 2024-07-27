
const Order = require('../models/Order');
const Product = require('../models/Product');

// controllers/orderController.js
exports.getSalesSummary = async (req, res) => {
    const adminId = req.admin._id; // Current admin's ID

    try {
        // Fetch orders for the given admin
        const orders = await Order.find({
            'products.product': { $in: await Product.find({ admin: adminId }).select('_id').then(products => products.map(p => p._id)) }
        });

        // Calculate total sales, total orders, and average order value
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        // Sales growth calculation (example using monthly data)
        const salesGrowth = {}; // Format this as needed for charts
        const monthlySales = orders.reduce((acc, order) => {
            const month = new Date(order.createdAt).toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + order.totalAmount;
            return acc;
        }, {});

        for (const [month, amount] of Object.entries(monthlySales)) {
            salesGrowth[month] = amount;
        }

        res.status(200).json({
            totalSales,
            totalOrders,
            averageOrderValue,
            salesGrowth
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
