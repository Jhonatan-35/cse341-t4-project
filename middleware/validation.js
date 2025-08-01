const { body, param } = require('express-validator');

// Validation for user registration
const validateRegistration = () => {
    return [
        body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('email').isEmail().withMessage('Email must be valid'),
    ];
};

// Validation for user login
const validateLogin = () => {
    return [
        body('email').isString().withMessage('Email is required'),
        body('password').isString().withMessage('Password is required'),
    ];
};

// Validation for getting user profile
const getUserProfileValidation = () => {
    return [
        param('id').isMongoId().withMessage('Invalid user ID'),
    ];
};

// Validation for updating user info
const validateUpdateUser = () => {
    return [
        param('id').isMongoId().withMessage('Invalid user ID'),
        body('username').optional().isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('email').optional().isEmail().withMessage('Email must be valid'),
    ];
};

// Validation for deleting user account
const validateDeleteUser = () => {
    return [
        param('id').isMongoId().withMessage('Invalid user ID'),
    ];
};

// Validation for movie endpoints
const movieValidation = {
    addMovie: () => {
        return [
            body('title').isString().withMessage('Title is required'),
            body('description').isString().withMessage('Description is required'),
            body('releaseDate').isDate().withMessage('Release date must be a valid date'),
        ];
    },
    updateMovie: () => {
                return [
            param('id').isMongoId().withMessage('Invalid movie ID'),
            body('title').optional().isString().withMessage('Title must be a string'),
            body('description').optional().isString().withMessage('Description must be a string'),
            body('releaseDate').optional().isDate().withMessage('Release date must be a valid date'),
        ];
    },
    getMovieDetails: () => {
        return [
            param('id').isMongoId().withMessage('Invalid movie ID'),
        ];
    },
    deleteMovie: () => {
        return [
            param('id').isMongoId().withMessage('Invalid movie ID'),
        ];
    },
};

// Validation for favorites
const favoriteValidation = {
    getFavorites: () => {
        return [
            param('id').isMongoId().withMessage('Invalid user ID'),
        ];
    },
    addFavorite: () => {
        return [
            param('id').isMongoId().withMessage('Invalid user ID'),
            body('movieId').isMongoId().withMessage('Invalid movie ID'),
            ];
    },
    removeFavorite: () => {
        return [
            param('id').isMongoId().withMessage('Invalid user ID'),
            param('movieId').isMongoId().withMessage('Invalid movie ID'),
        ];
    },
};

// Validation for reviews
const reviewValidation = {
    getReviews: () => {
        return [
            param('id').isMongoId().withMessage('Invalid movie ID'),
        ];
    },
    submitReview: () => {
        return [
            param('id').isMongoId().withMessage('Invalid movie ID'),
            body('review').isString().withMessage('Review is required'),
        ];
    },
    editReview: () => {
        return [
            param('reviewId').isMongoId().withMessage('Invalid review ID'),
            body('review').optional().isString().withMessage('Review must be a string'),
        ];
    },
    deleteReview: () => {
        return [
            param('reviewId').isMongoId().withMessage('Invalid review ID'),
        ];
    },
};

// Validation for watchlist
const watchlistValidation = {
    getWatchlist: () => {
        return [
            param('id').isMongoId().withMessage('Invalid user ID'),
        ];
    },
    addToWatchlist: () => {
        return [
            param('id').isMongoId().withMessage('Invalid user ID'),
            body('movieId').isMongoId().withMessage('Invalid movie ID'),
            ];
    },
    removeFromWatchlist: () => {
        return [
            param('id').isMongoId().withMessage('Invalid user ID'),
            param('movieId').isMongoId().withMessage('Invalid movie ID'),
        ];
    },
};

module.exports = {
    validateRegistration,
    validateLogin,
    getUserProfileValidation,
    validateUpdateUser,
    validateDeleteUser,
    movieValidation,
    favoriteValidation,
    reviewValidation,
    watchlistValidation,
};