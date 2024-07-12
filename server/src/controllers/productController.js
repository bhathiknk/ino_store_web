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

// Get products by admin ID
exports.getProductsByAdmin = async (req, res) => {
    const adminId = req.admin._id; // Assuming you have middleware that sets req.admin from JWT

    try {
        const products = await Product.find({ admin: adminId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
