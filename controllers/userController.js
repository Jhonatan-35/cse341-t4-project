const User = require('../models/userModel');

// Get user profile
exports.getUserProfile = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'User profile retrieved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error getting user profile', error: error.message });
  }
};

// Update user info (only lastname, phone, birthday — no body validation)
exports.updateUser = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        lastname: req.body.lastname,
        phone: req.body.phone,
        birthday: req.body.birthday
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User profile update information not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};



// Delete user account
exports.deleteUser = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const userId = req.user?.id || req.user?._id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'User profile deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user profile', error: error.message });
  }
};
