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

const app = express(); // The app object is created here

app.set('trust proxy', 1); 

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'



// Middleware
app.use(bodyParser.json());
app.use(express.json());



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
        secure: true,      // Must be true for HTTPS on Render
        httpOnly: true,    // Good practice
        sameSite: 'none',  // This is for cross-site requests
        domain: process.env.APP_DOMAIN, // This is to access the cookie in the frontend
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
// Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(cors({
    origin: ["https://cse341-t4-project.onrender.com"],
    credentials: true
}));

// GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        console.log('GitHub profile email:', email);

        if (!email) {
            console.error('Error: Email not available from GitHub');
            return done(new Error('Email not available from GitHub'));
        }

        let user = await User.findOne({ email });
        console.log('User found in DB:', user);

        if (user) {
            user.username = profile.username || 'unknown';
            user.firstname = profile.displayName || profile.username || 'GitHub User'; // Corrected
            await user.save();
            console.log('Existing user updated:', user);
        } else {
            user = await User.create({
                email,
                username: profile.username || 'unknown',
                firstname: profile.displayName || profile.username || 'GitHub User',
                lastname: '',
                phone: '',
                birthday: ''
            });
            console.log('New user created:', user);
        }

        if (!user || !user._id) {
            console.error('Fatal Error: User object is invalid or missing _id', user);
            return done(new Error('Invalid user object returned from database.'));
        }

        return done(null, user);

    } catch (err) {
        console.error('Error during GitHub authentication:', err);
        return done(err);
    }
}));


// Passport Serialization and Deserialization
passport.serializeUser((user, done) => {
    console.log('Serializing user with ID:', user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user with ID:', id);
        const user = await User.findById(id);
        
        if (user) {
            console.log('User found in deserializeUser:', user._id);
        } else {
            console.log('User NOT found in deserializeUser for ID:', id);
        }

        done(null, user);
    } catch (err) {
        console.error('Error during deserialization:', err);
        done(err);
    }
});


// Routes
app.get('/', (req, res) => {
    console.log('Accessing root route. Is user authenticated?', !!req.user);
    if (req.user) {
        console.log('Authenticated user:', req.user.firstname);
    }
    res.send(req.user ? `Logged in as ${req.user.firstname}` : "Logged out");
});

app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true
}), (req, res) => {
    console.log('GitHub authentication successful!');
    console.log('Session after successful login:', req.session); 
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