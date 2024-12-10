const { MongoClient } = require('mongodb');

const connectToDatabase = async () => {
  try {
    const uri = 'mongodb://localhost:27017/auth'; // Replace with your MongoDB URI
    const client = new MongoClient(uri); // No need to pass deprecated options
    await client.connect(); // Connect to the database
    console.log('Connected to MongoDB');
    return client.db(); // Return the database instance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Rethrow the error for further handling
  }
};

module.exports = connectToDatabase;
