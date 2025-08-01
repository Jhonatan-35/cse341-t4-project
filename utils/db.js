// Let's us this connection from here in the server.js file
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDb = async () => {
    try {
         const connect = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/movie-cse341", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to DB', connect.connection.host, connect.connection.name);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDb;