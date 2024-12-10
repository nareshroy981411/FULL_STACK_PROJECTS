const connectToDatabase = require('../config/database');
const { ObjectId } = require('mongodb'); // Import ObjectId for handling MongoDB _id.

// Function to get user by ID
const getUserById = async (id) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) }); // Use ObjectId for MongoDB's _id field.
    return user;
  } catch (error) {
    throw new Error('Error retrieving user by ID');
  }
};

// Function to get user by email
const getUserByEmail = async (email) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email }); // Query using the email field.
    return user;
  } catch (error) {
    throw new Error('Error retrieving user by email');
  }
};

// Function to create a new user
const createUser = async ({ username, email, password, role }) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').insertOne({ username, email, password, role }); // Insert the new user document.
    return user; // Return the result of the insertion
  } catch (error) {
    throw new Error('Error creating user');
  }
};


module.exports = { getUserByEmail, createUser, getUserById };
