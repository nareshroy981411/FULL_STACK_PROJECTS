const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generates a salt
  return await bcrypt.hash(password, salt); // Hash the password with the salt
};

// Function to verify a password against a hashed password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword); // Compares passwords
};

// Function to generate a JWT token
const generateToken = (userId, role) => {
  const jwtSecret = "your_secret_key"; // Use environment variable for secret
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined'); // Ensure secret is defined
  const jwtExpiresIn = '1h'; // Token expiry duration
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: jwtExpiresIn }); // Create the token
};

module.exports = { hashPassword, verifyPassword, generateToken };
