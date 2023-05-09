// Import required dependencies
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Import the getWeather function from the './api/routes' module
const { getWeather } = require('./api/routes');

// Set the port number to listen on, using the value of the PORT environment variable if available
const port = process.env.PORT || 5000;

// Create an instance of the Express application
const app = express();

// Parse incoming request bodies as JSON
app.use(express.json());

// Log incoming requests using the Morgan logging library, writing the logs to a file called 'access.log' in the 'logs' directory
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'logs', 'access.log')) }));

// Define a route that responds to GET requests to the root path ('/') by calling the getWeather function
app.get('/', getWeather);

// Define a catch-all middleware that responds to any other requests with a 404 Not Found error
app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found!'
    });
});

// Start the server, listening on the specified port number and logging a message when the server is ready
app.listen(port, () => {
    console.info(`Server listening on port: ${port}.`);
});
