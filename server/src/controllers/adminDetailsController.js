const Admin = require('../models/Admin');

// Controller function to get admin details
exports.getAdminDetails = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error in getAdminDetails:', error);
        res.status(500).json({ message: error.message });
    }
};

