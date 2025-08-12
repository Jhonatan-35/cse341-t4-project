const express = require('express');
const {
  getUserProfile,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  validateUpdateUser,
  validateDeleteUser
} = require('../middleware/validation');

const authenticate = require('../middleware/auth');
const isAuthenticated = require('../middleware/authenticate');

const router = express.Router();

//  Get user profile
router.get('/me', isAuthenticated, getUserProfile);

// Update user info
router.put('/me', isAuthenticated, validateUpdateUser(), updateUser);

// Delete user account
router.delete('/me', isAuthenticated, validateDeleteUser(), deleteUser);

module.exports = router;
