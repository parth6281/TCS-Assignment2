// Import the required dependencies
const { MongoClient } = require('mongodb');
const { DB_URL, DB } = require('./config');

// Initialize variables to hold the database connection and client
let db = null;
const client = new MongoClient(DB_URL);

// Define an async function to connect to the MongoDB server and return the database instance
async function connect() {
    // Connect the client to the server
    await client.connect();
    // Connect to the Database specified by the "DB"
    db = await client.db(`${DB}`);
    // Return the connected database instance
    return db
}

// Define an async function to disconnect from the MongoDB server
async function disconnect() {
    // Close the MongoDB client
    await client.close();
}

// Export the connect and disconnect functions for use by other modules
module.exports = { connect, disconnect };
