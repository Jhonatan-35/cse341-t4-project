const express = require('express');
const { getUserProfile, updateUser, deleteUser } = require('../controllers/userController');
const { validateUpdateUser, validateDeleteUser } = require('../middleware/validation');
const authenticate = require('../middleware/auth'); 

const router = express.Router();

// Get user profile
router.get('/me', authenticate, getUserProfile);

// Update user info
router.put('/me', authenticate, validateUpdateUser(), updateUser);  

// Delete user account
router.delete('/me', authenticate, validateDeleteUser(), deleteUser);

module.exports = router;