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
const MongoStore = require('connect-mongo');

dotenv.config();

console.log('Using GITHUB_CALLBACK_URL:', process.env.GITHUB_CALLBACK_URL);

const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// CORS should be placed before session and passport middleware
app.use(cors({
    origin: ["https://cse341-t4-project-9zue.onrender.com"],
    credentials: true
}));

// Session config (using a persistent Mongo store)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        // 'domain' can cause issues on some platforms. 
        // domain: process.env.APP_DOMAIN,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth
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
        if (user) {
            user.username = profile.username || 'unknown';
            user.firstname = profile.displayName || profile.username || 'GitHub User';
            await user.save();
        } else {
            user = await User.create({
                email,
                username: profile.username || 'unknown',
                firstname: profile.displayName || profile.username || 'GitHub User',
                lastname: '',
                phone: '',
                birthday: ''
            });
        }
        if (!user || !user._id) {
            return done(new Error('Invalid user object returned from database.'));
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Passport Serialization and Deserialization
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.get('/', (req, res) => {
    res.send(req.user ? `Logged in as ${req.user.firstname}` : "Logged out");
});

app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true
}), (req, res) => {
    res.redirect('/api-docs');
});

// Route imports
app.use('/', require('./routes/swagger'));
app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling
app.use(errorHandler);
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

// Start server
connectDb();
app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});