const Admin = require('../models/Admin');

// Controller function to get admin details
exports.getAdminDetails = async (req, res) => {
    try {
        // req.admin is populated by the protect middleware
        const admin = await Admin.findById(req.admin._id).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
