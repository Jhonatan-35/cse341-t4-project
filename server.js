const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./utils/db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');

// Load environment variables
dotenv.config();


app.use(bodyParser.json())
    .use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true
    }))
    // This is the basic express session ({...}) initialization.
    .use(passport.initialize())
    // Init passport on every route call
    .use(passport.session())
    // allow passport to use "express-session"
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Z-key"
        );
        res.setHeader(
            'Access-Control-Allow-Methods',
            'PUT, POST, GET, DELETE, OPTIONS'
        );
        next();
    })
    .use(cors({
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        origin: "*",
    }))
    .use('/', require('./routes')); // Routes
// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, function (accessToken, refreshToken, user, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return done(null, user);
    // });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out")
});


app.get('/api/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});



// // Routes
// app.get('/', (req, res) => {
//     res.redirect('/api');
// });

// Swagger Routes
app.use('/', require('./routes/swagger'));

app.use('/', require('./routes/index.js'));

// Error handling middleware
app.use(errorHandler);
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});


// Database connection
connectDb();
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});