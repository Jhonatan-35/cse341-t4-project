const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { reviewValidation } = require('../middleware/validation');
const authenticate = require('../middleware/auth');

// Get reviews for a specific movie
router.get('/:id/reviews', reviewValidation.getReviews(), reviewController.getReviews);

// Submit a review for a specific movie
router.post('/:id/reviews', authenticate, reviewValidation.submitReview(), reviewController.submitReview);

// Edit a review
router.put('/reviews/:reviewId', authenticate, reviewValidation.editReview(), reviewController.editReview);

// Remove a review
router.delete('/reviews/:reviewId', authenticate, reviewValidation.deleteReview(), reviewController.deleteReview);

module.exports = router;