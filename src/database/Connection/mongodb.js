const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://gabriellyn:admin1234@cluster0.hurdwsi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'yourDatabaseName';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;
  
/*    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Employees');
*/