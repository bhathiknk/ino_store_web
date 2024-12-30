const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const adminId = req.admin._id; // Assuming you're using admin authentication
        const notifications = await Notification.find({ recipient: adminId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ message: error.message });
    }
};
