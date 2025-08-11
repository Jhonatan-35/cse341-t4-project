const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const isAuthenticated = require('../middleware/authenticate');
const { movieValidation } = require('../middleware/validation');

// Movie Endpoints
router.get('/', movieController.getMovies); // Get list of movies
router.get('/:id', movieController.getMovieDetails); // Get details of a specific movie

// Changing the routes to use OAuth authentication
router.post('/', isAuthenticated, movieValidation.addMovie(), movieController.addMovie); // Add a new movie
router.put('/:id', isAuthenticated, movieValidation.updateMovie(), movieController.updateMovie); // Update movie info
router.delete('/:id', isAuthenticated, movieValidation.deleteMovie(), movieController.deleteMovie); // Remove a movie

module.exports = router;