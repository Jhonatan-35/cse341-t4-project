const Watchlist = require('../models/watchlist');

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
    // #swagger.tags = ['Watchlist']
    try {
        const userId = req.params.id;
        const watchlist = await Watchlist.find({ userId });
        res.status(200).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving watchlist', error });
    }
};

// Add movie to watchlist
exports.addToWatchlist = async (req, res) => {
    // #swagger.tags = ['Watchlist']
    try {
        const userId = req.params.id;
        const { movieId } = req.body;
        const newEntry = await Watchlist.create({ userId, movieId });
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to watchlist', error });
    }
};

// Remove movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
    // #swagger.tags = ['Watchlist']
    try {
        const userId = req.params.id;
        const movieId = req.params.movieId;
        await Watchlist.deleteOne({ userId, movieId });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error removing from watchlist', error });
    }
};