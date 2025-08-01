const router = require('express').Router();


// Favorite Routes
// router.use('/favorites', require('./favoriteRoutes'));

// Authentication Routes
router.use('/auth', require('./authRoutes'));

// User Routes
router.use('/users', require('./userRoutes'));

// Movie Routes
router.use('/movies', require('./movieRoutes'));

// Review Routes
// router.use('/reviews', require('./reviewRoutes'));

// Watchlist Routes
// router.use('/watchlist', require('./watchlistRoutes'));

module.exports = router;