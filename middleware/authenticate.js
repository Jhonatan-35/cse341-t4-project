const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        console.log("User not authenticated");
        res.status(401).json({
            message: "You do not have access"
        });
    } else {
        console.log("User authenticated");
        next();
    }
}

module.exports = isAuthenticated;