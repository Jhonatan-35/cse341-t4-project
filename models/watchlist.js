const mongoose = require('mongoose');


const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    }
}, { timestamps: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;