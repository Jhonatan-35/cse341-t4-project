const User = require('../models/userModel');

// Get user profile
exports.getUserProfile = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ "message": "User profile not found" });
        }
        res.status(200).json({ "message": "User profile retrieved successfully", user });
    } catch (error) {
        res.status(500);
        throw new Error({ "message": "Error getting user profile", "error": error.message });
    }
};

// Update user info
exports.updateUser = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const { username, email, firstname, lastname, phone, birthday } = req.body,
                userId = req.user.id;

        if (!username || !email || !firstname || !lastname || !phone || !birthday) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        // check if user exists
        if (!userId) {
            return res.status(404).json({ "message": "User profile not found" });
        }   

        // update user
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, firstname, lastname, phone, birthday }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ "message": "User profile update information not found" });
        }
        res.status(200).json({ "message": "User profile updated successfully", updatedUser });
    } catch (error) {
        res.status(500);
        throw new Error({ "message": "Error updating user profile", "error": error.message });
    }
};

// Delete user account
exports.deleteUser = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ "message": "User profile not found" });
        }
        res.status(200).json({ "message": "User profile deleted successfully", deletedUser });
    } catch (error) {
        res.status(500);
        throw new Error({ "message": "Error deleting user profile", "error": error.message });
    }
};