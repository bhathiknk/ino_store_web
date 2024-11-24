const jwt = require('jsonwebtoken');
const Handler = require('../models/Handler');
const config = require('../config/config');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

// Handler signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const handlerExists = await Handler.findOne({ email });

        if (handlerExists) {
            return res.status(400).json({ message: 'Handler already exists' });
        }

        const handler = new Handler({
            name,
            email,
            password,
        });

        const savedHandler = await handler.save();

        res.status(201).json({
            _id: savedHandler._id,
            name: savedHandler.name,
            email: savedHandler.email,
            token: generateToken(savedHandler._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handler signin
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const handler = await Handler.findOne({ email });

        if (handler && (await handler.matchPassword(password))) {
            res.json({
                _id: handler._id,
                name: handler.name,
                email: handler.email,
                token: generateToken(handler._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
