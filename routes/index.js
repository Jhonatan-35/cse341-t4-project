const router = require('express').Router();


router.get('/api', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Movie API' });
});

// Authentication Routes
router.use('/api/auth', require('./authRoutes'));

// User Routes
router.use('/api/users', require('./userRoutes'));

// Movie Routes
router.use('/api/movies', require('./movieRoutes'));

// Favorite Routes
router.use('/favorites', require('./favoriteRoutes'));

// Review Routes
// router.use('/api/reviews', require('./reviewRoutes'));

// Watchlist Routes
// router.use('/api/watchlist', require('./watchlistRoutes'));

module.exports = router;