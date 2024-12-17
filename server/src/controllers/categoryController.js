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

    try {
        // Find the category by name
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Split the category description into an array of individual descriptions
        const descriptions = category.description.split(',').map(desc => desc.trim());

        // Find products with matching category descriptions
        const products = await Product.find({ categoryDescription: { $in: descriptions } });

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




//Subcategories by Category Name
exports.getSubcategoriesByCategoryName = async (req, res) => {
    const { categoryName } = req.params; // Get category name from the URL

    try {
        // Find the category by name
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Split the category description into subcategories (array of strings)
        const subcategories = category.description.split(',').map(desc => desc.trim());

        res.status(200).json({
            category: category.name,
            subcategories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



//Products by Subcategory
exports.getProductsBySubcategory = async (req, res) => {
    const { subcategoryName } = req.params; // Get subcategory name from the URL

    try {
        // Find products that match the subcategory
        const products = await Product.find({ categoryDescription: new RegExp(subcategoryName, 'i') });

        if (!products.length) {
            return res.status(404).json({ message: 'No products found for this subcategory' });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
