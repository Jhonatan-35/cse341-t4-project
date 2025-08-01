const express = require('express');
const { getUserProfile, updateUser, deleteUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', authenticate, getUserProfile);

// Update user info
router.put('/:id', authenticate, validateUser, updateUser);

// Delete user account
router.delete('/:id', authenticate, deleteUser);

module.exports = router;