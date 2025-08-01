const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authenticate = require('../middleware/auth');
const { movieValidation } = require('../middleware/validation');

// Movie Endpoints
router.get('/', movieController.getMovies); // Get list of movies
router.get('/:id', movieController.getMovieDetails); // Get details of a specific movie
router.post('/', authenticate, movieValidation.addMovie(), movieController.addMovie); // Add a new movie
router.put('/:id', authenticate, movieValidation.updateMovie(), movieController.updateMovie); // Update movie info
router.delete('/:id', authenticate, movieValidation.deleteMovie(), movieController.deleteMovie); // Remove a movie

module.exports = router;