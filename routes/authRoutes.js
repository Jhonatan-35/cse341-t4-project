const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// User registration
router.post('/register', validateRegistration(), authController.register);

// User login
router.post('/login', validateLogin(), authController.login);

module.exports = router;