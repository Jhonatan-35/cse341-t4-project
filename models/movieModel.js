const mongoose = require('mongoose');

const movieSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a movie title'],
        },
        rated: {
            type: String,
        },
        released: {
            type: Date,
        },
        genre: {
            type: String,
        },
        director: {
            type: String,
        },
        actors: {
            type: String,
        },
        plot: {
            type: String,
        },
        poster: {
            type: String,
        },
        favoritedBy: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Movie', movieSchema);