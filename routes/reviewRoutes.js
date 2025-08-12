const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { reviewValidation } = require('../middleware/validation');
const authenticate = require('../middleware/auth');
const isAuthenticated = require('../middleware/authenticate');

// Get reviews for a specific movie
router.get('/:id/reviews', reviewValidation.getReviews(), reviewController.getReviews);

// Submit a review for a specific movie
router.post('/:id/reviews', isAuthenticated, reviewValidation.submitReview(), reviewController.submitReview);

// Edit a review
router.put('/reviews/:reviewId', isAuthenticated, reviewValidation.editReview(), reviewController.editReview);

// Remove a review
router.delete('/reviews/:reviewId', isAuthenticated, reviewValidation.deleteReview(), reviewController.deleteReview);

module.exports = router;