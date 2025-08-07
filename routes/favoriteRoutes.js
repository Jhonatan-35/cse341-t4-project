const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/:id', favoriteController.getFavorites); // Get favorites by user ID
router.post('/:id', favoriteController.addFavorite); // Add favorite for user
router.put('/:id/:movieId', favoriteController.updateFavorite);// Update personal rating for a favorite movie
router.delete('/:id/:movieId', favoriteController.removeFavorite); // Remove favorite

module.exports = router;
