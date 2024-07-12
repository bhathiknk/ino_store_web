const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { addProduct } = require('../controllers/productController');
const upload = require('../utils/fileUpload');
const router = express.Router();

router.post('/', protect, upload.array('images', 5), addProduct);

module.exports = router;
