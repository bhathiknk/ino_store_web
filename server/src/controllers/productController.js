const Product = require('../models/Product');
const path = require('path');

// Add product with images
exports.addProduct = async (req, res) => {
    const { title, categoryDescription, description, basePrice, discountPrice, isDiscount, isFreeShipping, shippingCost } = req.body;
    const adminId = req.admin._id;

    try {
        // Handle file uploads
        const images = req.files.map(file => `/uploads/products/${file.filename}`);

        const product = new Product({
            name: title,
            categoryDescription,
            description,
            price: isDiscount === 'true' ? discountPrice : basePrice,
            images,
            admin: adminId,
            isDiscount: isDiscount === 'true', // Convert to boolean
            basePrice,
            discountPrice,
            isFreeShipping: isFreeShipping === 'true', // Convert to boolean
            shippingCost: isFreeShipping === 'true' ? 0 : shippingCost // Adjust shipping cost based on isFreeShipping
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
}

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
