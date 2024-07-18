const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/get', categoryController.getAllCategories);

// Create a new category
router.post('/', categoryController.createCategory);

module.exports = router;
