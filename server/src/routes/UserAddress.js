// routes/address.js
const express = require('express');
const { protect } = require('../middlewares/userAuthMiddleware');
const { saveAddress , updateAddress ,getUserAddresses } = require('../controllers/UserAddressController');
const router = express.Router();

router.post('/save', protect, saveAddress);
router.put('/update/:id', protect, updateAddress);
router.get('/user', protect, getUserAddresses);

module.exports = router;
