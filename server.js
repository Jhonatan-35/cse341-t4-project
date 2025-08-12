const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./utils/db');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const User = require('./models/userModel');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Load environment variables
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: "*"
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-key");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
});

// GitHub OAuth Strategy (email only)
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error('Email not available from GitHub'));
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                username: profile.username || 'unknown',
                firstname: profile.displayName || profile.username || 'GitHub User',
                lastname: '',
                phone: '',
                birthday: ''
            });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.send(req.session.user ? `Logged in as ${req.session.user.firstname}` : "Logged out");
});

app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

app.use('/', require('./routes/swagger'));
app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/userRoutes')); // Profile routes only

// Error handling
app.use(errorHandler);
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Connect to DB and start server
connectDb();
app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
