const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Movie Endpoints
router.get('/', movieController.getMovies); // Get list of movies
router.get('/:id', movieController.getMovieDetails); // Get details of a specific movie
router.post('/', movieController.addMovie); // Add a new movie
router.put('/:id', movieController.updateMovie); // Update movie info
router.delete('/:id', movieController.deleteMovie); // Remove a movie

module.exports = router;