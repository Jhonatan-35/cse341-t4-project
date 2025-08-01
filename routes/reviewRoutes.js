const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { validateReview } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Get reviews for a specific movie
router.get('/:id/reviews', reviewController.getReviews);

// Submit a review for a specific movie
router.post('/:id/reviews', authenticate, validateReview, reviewController.submitReview);

// Edit a review
router.put('/reviews/:reviewId', authenticate, validateReview, reviewController.editReview);

// Remove a review
router.delete('/reviews/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;