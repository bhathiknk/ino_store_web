const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { addProduct, getProductsByAdmin } = require('../controllers/productController');
const { getProductById } = require('../controllers/productController');
const upload = require('../utils/fileUpload');
const router = express.Router();

router.post('/add', protect, upload.array('images', 5), addProduct);
router.get('/my-products', protect, getProductsByAdmin); // Endpoint to get products by admin ID

router.get('/products/:id', getProductById);

module.exports = router;
