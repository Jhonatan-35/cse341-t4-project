const Movie = require('../models/movieModel');

// Get list of movies
exports.getMovies = async (req, res) => {
    // #swagger.tags = ['Movies']
    try {
        const movies = await Movie.find({});
        if (!movies || movies.length === 0) {
            return res.status(404).json({ "message": "No movies found" });
        }
        return res.status(200).json({ "message": "Movies retrieved successfully", movies });
    } catch (e) {
        return res.status(500).json({ "message": "Error retrieving movies", "error": e.message });
    }
};

// Get details of a specific movie
exports.getMovieDetails = async (req, res, next) => {
    // #swagger.tags = ['Movies']
    const { id } = req.params;
    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ "message": "Movie not found" });
        }
        return res.status(200).json({ "message": "Movie details retrieved successfully", movie });
    } catch (error) {
        return res.status(500).json({
            "message": "Error retrieving movie details",
            "error": error.message
        });
    }
};

// Add a new movie
exports.addMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    try {
        const { title, description, releaseDate, genre, rating, imageUrl, country, producer } = req.body;

        const addMovie = await Movie.create({ title, description, releaseDate, genre, rating, imageUrl, country, producer });

        if (!addMovie) {
            return res.status(404).json({ message: "Error adding movie" });
            return res.status(404).json({ message: "Error adding movie" });
        }
        return res.status(201).json({ "message": "Movie added successfully", addMovie });
    } catch (error) {
        res.status(500);
        return res.status(500).json({ message: "Error adding movie", error: error.message });
    }
};

// Update movie info
exports.updateMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    const { id } = req.params;

    try {
        const { title, description, releaseDate, genre, rating, imageUrl } = req.body;
        if (!title || !description || !releaseDate || !genre || !rating || !imageUrl) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        // check if movie exists
        const updatedMovie = await Movie.findByIdAndUpdate(id, { title, description, releaseDate, genre, rating, imageUrl }, {
            new: true,
        });

        if (!updatedMovie) {
            return res.status(404).json({ "message": "Movie not found", "error": error.message });
        }
        return res.status(200).json({ "message": "Movie updated successfully", updatedMovie });
    } catch (error) {
        return res.status(400).json({
            "message": "Error updating movie",
            "error": error.message
        });
    }
};

// Update movie info
exports.updateMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    /* #swagger.parameters['id'] = { description: 'Movie ID', type: 'string', schema: 'string' } 
    #swagger.parameters['title'] = { description: 'Movie Title', type: 'string', schema: 'string' } 
    #swagger.parameters['director'] = { description: 'Movie Director', type: 'string', schema: 'string' } 
    #swagger.parameters['genre'] = { description: 'Movie Genre', type: 'array', items: { type: 'string' } } 
    #swagger.parameters['rating'] = { description: 'Movie Rating', type: 'number', schema: 'number' } 
    #swagger.parameters['duration'] = { description: 'Movie Duration', type: 'number', schema: 'number' } 
    #swagger.parameters['poster'] = { description: 'Movie Poster URL', type: 'string', schema: 'string' } 
    #swagger.parameters['country'] = { description: 'Country of Production', type: 'string', schema: 'string' } 
    #swagger.parameters['producer'] = { description: 'Movie Producer', type: 'string', schema: 'string' } 
    #swagger.parameters['description'] = { description: 'Movie Description', type: 'string', schema: 'string' } 
    #swagger.parameters['releaseDate'] = { description: 'Release Date', type: 'string', format: 'date' } */
    
    const { id } = req.params;

    try {
        const {
            title,
            director,
            genre,
            rating,
            duration,
            poster,
            country,
            producer,
            description,
            releaseDate
        } = req.body;

        if (!title || !director || !genre || !rating || !duration || !poster || !country || !producer || !description || !releaseDate) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            {
                title,
                director,
                genre,
                rating,
                duration,
                poster,
                country,
                producer,
                description,
                releaseDate
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMovie) {
            return res.status(404).json({ "message": "Movie not found", "error": error.message });
        }
        return res.status(200).json({ "message": "Movie updated successfully", updatedMovie });
    } catch (error) {
        return res.status(400).json({
            "message": "Error updating movie",
            "error": error.message
        });
    }
};

// Remove a movie
exports.deleteMovie = async (req, res) => {
    // #swagger.tags = ['Movies']
    /* #swagger.parameters['id'] = {
        description: 'Movie ID',                   
        type: 'string',                          
        schema: 'string'    
    } */
    const { id } = req.params;
    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ "message": "Movie not found", "error": error.message });
        }
        return res.status(204).send({ "message": "Movie deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            "message": "Error deleting movie",
            "error": error.message
        });
    }
};
