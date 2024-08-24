const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
// specific database
const dbName='iNotebook1'

async function connectToMongo() {
    try {
        await mongoose.connect(url, {
            dbName
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

module.exports = connectToMongo;
