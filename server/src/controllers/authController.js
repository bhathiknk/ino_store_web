const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/config');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

// Admin signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Admin({
            name,
            email,
            password,
            isApproved: false, // Default is false
        });

        const savedAdmin = await admin.save();

        res.status(201).json({
            message: 'Signup request submitted. Awaiting approval by handler.',
            adminId: savedAdmin._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin signin
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!admin.isApproved) {
            return res.status(403).json({ message: 'Your account has not been approved by the handler yet.' });
        }

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isApproved: admin.isApproved,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

