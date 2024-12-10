const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId, role) => {
  const jwtSecret = "your_secret_key";
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
  const jwtExpiresIn = '1h';
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: jwtExpiresIn });
};

module.exports = { hashPassword, verifyPassword, generateToken };
