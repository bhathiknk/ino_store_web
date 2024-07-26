const Order = require('../models/Order');

// Get Sales Summary
exports.getSalesSummary = async (req, res) => {
    try {
        const orders = await Order.find({ isPaid: true });

        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders ? (totalSales / totalOrders).toFixed(2) : 0;

        // Assuming you have order creation timestamps to track sales growth
        const salesGrowth = orders.reduce((acc, order) => {
            const monthYear = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = { count: 0, total: 0 };
            }
            acc[monthYear].count += 1;
            acc[monthYear].total += order.totalAmount;
            return acc;
        }, {});

        res.status(200).json({
            totalSales,
            totalOrders,
            averageOrderValue,
            salesGrowth,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
