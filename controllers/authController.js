
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
exports.register = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const { username, email, password, firstname, lastname, phone, birthday } = req.body;
        if (!username || !email || !password || !firstname || !lastname || !phone || !birthday) {
            res.status(400);
            throw new Error('All fields are required');
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, firstname, lastname, phone, birthday });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...userData } = user.toObject();
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : error.message
        });
    }
};