// routes/address.js
const express = require('express');
const { protect } = require('../middlewares/userAuthMiddleware');
const { saveAddress , updateAddress  } = require('../controllers/UserAddressController');
const router = express.Router();

router.post('/save', protect, saveAddress);
router.put('/update/:id', protect, updateAddress);

module.exports = router;
