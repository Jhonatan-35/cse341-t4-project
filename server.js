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
const SQLiteStore = require('connect-sqlite3')(session);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(bodyParser.json());

// Session config (with SQLite store)
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.sqlite',
        dir: './db',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: false, 
    //     httpOnly: true,
    //     maxAge: 1000 * 60 * 60,
    // }

    cookie: {
    secure: true, // IMPORTANT: Now that you are on HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: 'lax' // Recommended for security
},
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Preflight handling
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-key");
//     res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
//     if (req.method === "OPTIONS") return res.sendStatus(200);
//     next();
// });

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
            // User already exists, update their profile information if needed
            // For example, update the username
            user.username = profile.username || 'unknown';
            await user.save();
        } else {
            // User does not exist, create a new one
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

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user with ID:', id);
        const user = await User.findById(id);
        if (user) {
            console.log('User found in DB:', user.email);
            done(null, user);
        } else {
            console.log('User not found in DB for ID:', id);
            done(null, null); // Pass null for no user
        }
    } catch (err) {
        console.error('Error during deserialization:', err);
        done(err);
    }
});

// Routes
// app.get('/', (req, res) => {
//     res.send(req.user ? `Logged in as ${req.user.firstname}` : "Logged out");
// });

app.get('/', (req, res) => {
    console.log('Accessing root route. Is user authenticated?', !!req.user);
    if (req.user) {
        console.log('Authenticated user:', req.user.firstname);
    }
    res.send(req.user ? `Logged in as ${req.user.firstname}` : "Logged out");
});

app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// app.get('/api/github/callback', passport.authenticate('github', {
//     failureRedirect: '/api-docs',
//     session: true
// }), (req, res) => res.redirect('/'));

app.get('/api/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true
}), (req, res) => {
    console.log('GitHub authentication successful!');
    console.log('User serialized:', req.user._id);
    res.redirect('/');
});

// Route imports (unchanged from old)
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
