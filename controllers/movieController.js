const Movie = require('../models/movieModel');

// Get list of movies
exports.getMovies = async (req, res) => {
    // #swagger.tags = ['Movies']
    try {
        const movies = await Movie.find({});
        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }
        return res.status(200).json(movies);
    } catch (e) {
        return res.status(500).json({ message: 'Error retrieving movies', error: e.message });
    }
};

// Get details of a specific movie
exports.getMovieDetails = async (req, res, next) => {
    // #swagger.tags = ['Movies']
    const { id } = req.params;
    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.status(200).json({ movie });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error retrieving movie details', 
            error: error.message 
        });
    }
};

// Add a new movie
exports.addMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    try {
        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();
        return res.status(201).json(savedMovie);
    } catch (error) {
        return res.status(400).json({ 
            message: 'Error adding movie', 
            error: error.message 
        });
    }
};

// Update movie info
exports.updateMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    const { id } = req.params;
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { 
            new: true,
            runValidators: true 
        });
        
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.status(200).json(updatedMovie);
    } catch (error) {
        return res.status(400).json({ 
            message: 'Error updating movie', 
            error: error.message 
        });
    }
};

// Remove a movie
exports.deleteMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    const { id } = req.params;
    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error deleting movie', 
            error: error.message 
        });
    }
};