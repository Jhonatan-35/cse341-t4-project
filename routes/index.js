const router = require('express').Router();
const passport = require('passport');

router.get('/api', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Movie API' });
});

// Authentication Routes
// router.use('/api/auth', require('./authRoutes'));

// Define routes for authentication
router.get('/login', passport.authenticate('github'));

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        };
        res.redirect('/');
    });
});


// User Routes
router.use('/api/users', require('./userRoutes'));

// Movie Routes
router.use('/api/movies', require('./movieRoutes'));

// Favorite Routes
router.use('/api/favorites', require('./favoriteRoutes'));

// Review Routes
router.use('/api/movies', require('./reviewRoutes'));

// Watchlist Routes
// router.use('/api/watchlist', require('./watchlistRoutes'));

module.exports = router;