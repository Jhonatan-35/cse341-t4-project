// In file: ../middleware/authenticate.js

const isAuthenticated = (req, res, next) => {
    console.log('Checking authentication for protected route...');
    console.log('req.user after deserialization:', req.user);
    
    if (req.isAuthenticated()) {
        console.log('User is authenticated!');
        return next();
    } else {
        console.log('User is NOT authenticated. req.isAuthenticated() returned false.');
        res.status(401).json({ message: 'You do not have access' });
    }
};

module.exports = isAuthenticated;