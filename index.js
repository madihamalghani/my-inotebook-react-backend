const express = require('express');

// const connectToMongo = require('./backend/db');
const connectToMongo = require('./db'); // Adjust if necessary

const app = express();
const port = 5000;

async function startServer() {
    try {
        await connectToMongo();
        console.log('Connected to MongoDB');
        // app.get('/', (req, res) => {
        //     res.send('Hello World!');
        // });
        // Available Routes:
        app.use(express.json());
        
        app.use('/api/auth',require('./routes/auth'));
        app.use('/api/notes',require('./routes/notes'));
        


        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

startServer();
