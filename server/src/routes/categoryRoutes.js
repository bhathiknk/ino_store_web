const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/get', categoryController.getAllCategories);

// Create a new category
router.post('/', categoryController.createCategory);

// Get subcategories for a specific category
router.get('/:categoryName/subcategories', categoryController.getSubcategoriesByCategoryName);

// Get products for a specific subcategory
router.get('/subcategory/:subcategoryName/products', categoryController.getProductsBySubcategory);

module.exports = router;
