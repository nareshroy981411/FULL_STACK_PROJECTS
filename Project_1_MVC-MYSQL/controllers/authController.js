const { hashPassword, verifyPassword, generateToken } = require('../models/helpers');
const { getUserByEmail, createUser } = require('../models/userModel');
const { getAdminByEmail, createAdmin } = require('../models/adminModel');
// const userModel = require('../models/userModel');
// const adminModel = require('../models/adminModel');

// const signup = async (req, res) => {
//   const { username, email, password, role } = req.body;

//   if (!username || !email || !password || !role) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     if (role === 'admin') {
//       const existingAdmin = await getAdminByEmail(email);
//       if (existingAdmin) return res.status(400).json({ message: 'Admin with this email already exists' });

//       const hashedPassword = await hashPassword(password);
//       await createAdmin(username, email, hashedPassword, role);
//     } else {
//       const existingUser = await getUserByEmail(email);
//       if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

//       const hashedPassword = await hashPassword(password);
//       await createUser(username, email, hashedPassword, role);
//     }

//     res.json({ message: 'User created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error signing up', error: error.message });
//   }
// };

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    const existingAdmin = await getAdminByEmail(email);

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
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
    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    const existingAdmin = await getAdminByEmail(email);

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    await createAdmin({ username, email, password: hashedPassword, role: 'admin' });

    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);
    if (admin) {
      const isMatch = await verifyPassword(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      const token = generateToken(admin.id, admin.role);
      return res.json({ message: 'Login successful', token, role: admin.role });
    }

    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user.id, user.role);
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { signupAdmin, signupUser, login };
