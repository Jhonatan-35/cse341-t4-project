// In file: ../middleware/authenticate.js

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: 'You do not have access' });
    }
};

module.exports = isAuthenticated;