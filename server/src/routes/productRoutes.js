const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { addProduct, getProductsByAdmin } = require('../controllers/productController');
const { getProductById } = require('../controllers/productController');
const {updateProduct} = require('../controllers/productController');
const {deleteProduct} = require('../controllers/productController');
const {getAllProducts} = require('../controllers/productController');
const upload = require('../utils/fileUpload');
const router = express.Router();

router.post('/add', protect, upload.array('images', 5), addProduct);
router.get('/my-products', protect, getProductsByAdmin); // Endpoint to get products by admin ID
router.get('/products/:id', getProductById); //endpoint to get product details from seller
router.put('/products/update/:id', protect, upload.array('images', 5), updateProduct); // Endpoint to update product from seller
router.delete('/products/delete/:id', protect, deleteProduct); //endpoint for delete product from seller
router.get('/user/products', protect, getAllProducts); //Endpoint for get all product to user interface


module.exports = router;
