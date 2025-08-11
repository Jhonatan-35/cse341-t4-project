const Review = require('../models/reviewModel');

// Get all reviews for a specific movie
exports.getReviews = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Get all reviews for a specific movie'
  try {
    const reviews = await Review.find({ movieId: req.params.id }).lean();
    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this movie.' });
    }
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews.', error: err.message });
  }
};

// Submit a new review
exports.submitReview = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Submit a review for a specific movie'
  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $review: 'Loved the cinematography!',
        $rating: 5
      }
  } */
  try {
    const { review, rating } = req.body;
    const newReview = new Review({
      userId: req.user._id,
      movieId: req.params.id,
      review,
      rating
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this movie.' });
    }
    res.status(500).json({ message: 'Error submitting review.', error: err.message });
  }
};

// Edit an existing review
exports.editReview = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Edit an existing review'
  try {
    const { review, rating } = req.body;
    const updated = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, userId: req.user._id },
      { review, rating },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating review.', error: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Delete a review'
  try {
    const deleted = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      userId: req.user._id
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found or unauthorized.' });
    }
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review.', error: err.message });
  }
};
