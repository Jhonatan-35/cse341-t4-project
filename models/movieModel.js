const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    producer: {
        type: String,
        required: true,
    },
    genre: {
        type: [String], 
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
    duration: {
        type: Number,
        required: false, 
    },
    poster: {
        type: String,
        required: false, 
    },
    country: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: false, 
    },
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;