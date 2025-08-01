const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./utils/db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-key");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});


// Routes
app.get('/', (req, res) => {
    res.redirect('/api');
});

// Swagger Routes
app.use('/', require('./routes/swagger'));

app.use('/', require('./routes/index.js'));

// Error handling middleware
app.use(errorHandler);

// Database connection
connectDb();
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});