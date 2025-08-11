const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, favoriteController.getFavorites); // Get favorites by user ID
router.post('/', authenticate, favoriteController.addFavorite); // Add favorite for user
router.put('/:movieId', authenticate, favoriteController.updateFavorite);// Update personal rating for a favorite movie
router.delete('/:movieId', authenticate, favoriteController.removeFavorite); // Remove favorite

module.exports = router;
