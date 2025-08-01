const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { authenticate } = require('../middleware/auth');

// Get user's watchlist
router.get('/:id/watchlist', authenticate, watchlistController.getWatchlist);

// Add movie to watchlist
router.post('/:id/watchlist', authenticate, watchlistController.addToWatchlist);

// Remove movie from watchlist
router.delete('/:id/watchlist/:movieId', authenticate, watchlistController.removeFromWatchlist);

module.exports = router;