const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
    watchlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
}, { timestamps: true });

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password; // Exclude password from the response

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;