const Favorite = require('../models/favoriteModel');

// Get user's favorite movies
exports.getFavorites = async (req, res) => {
    // #swagger.tags = ['Favorites']
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
    // #swagger.tags = ['Favorites']
    try {
        const userId = req.params.id;
        const { movieId, personalRating } = req.body;

        if (personalRating === undefined) {
            return res.status(400).json({ message: 'personalRating is required' });
        }

        const favorite = new Favorite({ userId, movieId, personalRating });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite', error });
    }
};

// Update personal rating
exports.updateFavorite = async (req, res) => {
    // #swagger.tags = ['Favorites']
    try {
        const { id: userId, movieId } = req.params;
        const { personalRating } = req.body;

        const updatedFavorite = await Favorite.findOneAndUpdate(
            { userId, movieId },
            { $set: { personalRating } },
            { new: true }
        );

        if (!updatedFavorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json(updatedFavorite);
    } catch (error) {
        res.status(500).json({ message: 'Error updating favorite', error });
    }
};

// Remove a movie from favorites
exports.removeFavorite = async (req, res) => {
    // #swagger.tags = ['Favorites']
    try {
        const userId = req.params.id;
        const movieId = req.params.movieId;
        await Favorite.findOneAndDelete({ userId, movieId });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error });
    }
};
