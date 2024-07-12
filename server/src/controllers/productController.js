const Product = require('../models/Product');
const path = require('path');

// Add product with images
exports.addProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const adminId = req.admin._id;

    try {
        // Handle file uploads
        const images = req.files.map(file => `/uploads/products/${file.filename}`);

        const product = new Product({
            name,
            description,
            price,
            images,
            admin: adminId,
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
