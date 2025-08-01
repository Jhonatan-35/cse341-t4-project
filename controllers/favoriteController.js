const Favorite = require('../models/favorite');

// Get user's favorite movies
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.params.id;
        const favorites = await Favorite.find({ userId });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving favorites', error });
    }
};

// Add a movie to favorites
exports.addFavorite = async (req, res) => {
    try {
        const userId = req.params.id;
        const { movieId } = req.body;
        const favorite = new Favorite({ userId, movieId });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite', error });
    }
};

// Remove a movie from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.params.id;
        const movieId = req.params.movieId;
        await Favorite.findOneAndDelete({ userId, movieId });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error });
    }
};