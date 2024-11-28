const Admin = require('../models/Admin');

// Approve or reject an admin signup
exports.approveAdmin = async (req, res) => {
    const { id } = req.params;
    const { isApproved } = req.body; // true (approve) or false (reject)

    try {
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.isApproved = isApproved;
        const updatedAdmin = await admin.save();

        res.status(200).json({
            message: isApproved ? 'Admin approved successfully' : 'Admin rejected',
            admin: updatedAdmin,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pending admin signup requests
exports.getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await Admin.find({ isApproved: false });

        if (pendingAdmins.length === 0) {
            return res.status(404).json({ message: 'No pending admin requests found' });
        }

        res.status(200).json({
            message: 'Pending admin requests retrieved successfully',
            pendingAdmins,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject an admin signup request
exports.rejectAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await admin.deleteOne(); // Remove the admin record from the database

        res.status(200).json({
            message: 'Admin signup request rejected successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
