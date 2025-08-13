const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    genre: {
        type: String, // Corrected to be a single string
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
    duration: {
        type: Number,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    producer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: String, // Corrected to be a string
        required: true,
    },
}, {
    timestamps: true 
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;