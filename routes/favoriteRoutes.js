const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authenticate = require('../middleware/auth');
const isAuthenticated = require('../middleware/authenticate');

router.get('/', isAuthenticated, favoriteController.getFavorites); // Get favorites by user ID
router.post('/', isAuthenticated, favoriteController.addFavorite); // Add favorite for user
router.put('/:movieId', isAuthenticated, favoriteController.updateFavorite);// Update personal rating for a favorite movie
router.delete('/:movieId', isAuthenticated, favoriteController.removeFavorite); // Remove favorite

module.exports = router;
