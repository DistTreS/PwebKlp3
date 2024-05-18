const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });

async function connectToDatabase() {
    await client.connect();
    return client.db('logbook').collection('user');
}

module.exports = connectToDatabase;