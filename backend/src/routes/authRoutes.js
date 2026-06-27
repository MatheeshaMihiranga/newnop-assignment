const express = require('express');
const router  = express.Router();
const { login, register, getProfile } = require('../controllers/authController');
const { authenticate }                = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   authenticate, getProfile);

module.exports = router;

