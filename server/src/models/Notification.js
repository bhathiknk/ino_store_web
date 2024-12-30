const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        message: { type: String, required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // For seller
        timestamp: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
