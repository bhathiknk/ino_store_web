const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get products by category name
exports.getProductsByCategoryName = async (req, res) => {
    const { categoryName } = req.params;

    console.log(`Searching for category: ${categoryName}`);

    try {
        // Find the category by name
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        console.log(`Found category: ${category.name} with description: ${category.description}`);

        // Split the category description into an array of individual descriptions
        const descriptions = category.description.split(',').map(desc => desc.trim());

        // Find products with matching category descriptions
        const products = await Product.find({ categoryDescription: { $in: descriptions } });

        console.log(`Found products: ${products.length}`);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get products by category description
exports.getProductsByCategoryDescription = async (req, res) => {
    const { categoryDescription } = req.params;

    try {
        const products = await Product.find({ categoryDescription: new RegExp(categoryDescription, 'i') });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};