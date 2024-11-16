// routes/userAuthRoutes.js
const express = require('express');
const { signup, signin, getUserProfile } = require('../controllers/userAuthController'); // Adjust this path if necessary
const { protect } = require('../middlewares/userAuthMiddleware'); // Adjust this path if necessary
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);


// Add the "Get User Profile" route
router.get('/profile', protect, getUserProfile);

module.exports = router;
