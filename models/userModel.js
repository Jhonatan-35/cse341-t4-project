const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: false,
        trim: true
    },
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
    phone: {
        type: String,
        required: false,
        trim: true
    },
    birthday: {
        type: Date,
        required: false
    },
    password: {
        type: String,
        required: false
    },
}, { timestamps: true });

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password; // Exclude password from the response

    return userObject;
};

// Check if the model has already been defined
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;