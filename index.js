const express = require('express');
var cors = require('cors')
var app = express()



// const connectToMongo = require('./backend/db');
const connectToMongo = require('./db'); // Adjust if necessary

const port = 5000;
app.use(cors());
// app.use(express.json())
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
            console.log(`iNotebook backend listening at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

startServer();
