const Product = require('../models/Product');
const path = require('path');
const Category = require('../models/Category');
const fs = require('fs');

// Add product with images
exports.addProduct = async (req, res) => {
    const { title, categoryDescription, description, basePrice, discountPrice, isDiscount, isFreeShipping, shippingCost, quantity } = req.body;
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
            shippingCost: isFreeShipping === 'true' ? 0 : shippingCost, // Adjust shipping cost based on isFreeShipping
            quantity,
            inStock: quantity > 0 // Set inStock based on quantity
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

// Update product with images
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        categoryDescription,
        description,
        basePrice,
        discountPrice,
        isDiscount,
        isFreeShipping,
        shippingCost,
        quantity,
        removedImages = []
    } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let images = product.images;

        // Add newly uploaded images
        if (req.files && req.files.length > 0) {
            images = [...images, ...req.files.map(file => `/uploads/products/${file.filename}`)];
        }

        // Remove images marked for deletion
        images = images.filter(image => !removedImages.includes(image));

        // Ensure fields are correctly cast to their expected types
        product.name = name || product.name;
        product.categoryDescription = categoryDescription || product.categoryDescription;
        product.description = description || product.description;
        product.basePrice = Number(basePrice) || product.basePrice;
        product.discountPrice = isDiscount === 'true' ? Number(discountPrice) : null; // Only set if discount is applied
        product.isDiscount = isDiscount === 'true';
        product.isFreeShipping = isFreeShipping === 'true';
        product.shippingCost = isFreeShipping === 'true' ? 0 : Number(shippingCost) || product.shippingCost;
        product.quantity = Number(quantity) || product.quantity;
        product.images = images;
        product.inStock = product.quantity > 0;

        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete product images from the filesystem
        product.images.forEach(image => {
            const filePath = path.join(__dirname, '../', image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        // Delete product from the database
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all products for user interface
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};