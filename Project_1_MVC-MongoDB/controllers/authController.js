const { hashPassword, verifyPassword, generateToken } = require('../models/helpers');
const { getUserByEmail, createUser } = require('../models/userModel');
const { getAdminByEmail, createAdmin } = require('../models/adminModel');

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the email already exists in either users or admins collection
    const existingUser = await getUserByEmail(email);
    const existingAdmin = await getAdminByEmail(email);

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user document in MongoDB
    await createUser({ username, email, password: hashedPassword, role: 'user' });

    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};

const signupAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the email already exists in either users or admins collection
    const existingUser = await getUserByEmail(email);
    const existingAdmin = await getAdminByEmail(email);

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new admin document in MongoDB
    await createAdmin({ username, email, password: hashedPassword, role: 'admin' });

    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First check for an admin
    const admin = await getAdminByEmail(email);
    if (admin) {
      const isMatch = await verifyPassword(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      // Generate token for admin
      const token = generateToken(admin._id, admin.role); // MongoDB uses _id, not id
      return res.json({ message: 'Login successful', token, role: admin.role });
    }

    // If not an admin, check for a user
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate token for user
    const token = generateToken(user._id, user.role); // MongoDB uses _id, not id
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { signupAdmin, signupUser, login };
