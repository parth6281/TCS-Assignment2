const { MongoClient } = require('mongodb');
const { DB_URL, DB } = require('./config');

let db = null;
const client = new MongoClient(DB_URL);

async function connect() {
    // Connect the client to the server
    await client.connect();
    db = await client.db(`${DB}`);
    return db
}


module.exports = { connect };