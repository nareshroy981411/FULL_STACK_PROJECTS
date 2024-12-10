const connectToDatabase = require('../config/database');
const { hashPassword } = require('../models/helpers');
const { getAdminById } = require('../models/adminModel');
const { ObjectId } = require('mongodb');

const getAdminProfile = async (req, res) => {
  try {
    const admin = await getAdminById(req.user.id);
    console.log("User ID from token:", req.user.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin profile', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const users = await db.collection('users').find({}).project({ password: 0 }).toArray();
    res.json({ message: 'All users data', users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users data', error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const admins = await db.collection('admins').find({}).project({ password: 0 }).toArray();
    res.json({ message: 'All admins data', admins });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admins data', error: error.message });
  }
};

// const updateUser = async (req, res) => {
//   const userId = req.params.id;
//   const { username, email, role, password } = req.body;

//   if (!username || !email || !role || !password) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const db = await connectToDatabase();
//     const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const hashedPassword = await hashPassword(password);

//     if (user.role === 'user' && role === 'admin') {
//       await db.collection('admins').insertOne({
//         _id: user._id,
//         username,
//         email,
//         password: hashedPassword,
//         role,
//       });
//       await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
//       return res.json({ message: 'User moved to admins and updated successfully' });
//     }

//     await db.collection('users').updateOne(
//       { _id: new ObjectId(userId) },
//       { $set: { username, email, password: hashedPassword, role } }
//     );

//     res.json({ message: 'User updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating user', error: error.message });
//   }
// };

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, role, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !role || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the email already exists in the users or admins collection (excluding the current user)
    const isEmailDuplicateInUsers = await db.collection('users').findOne({ email });
    const isEmailDuplicateInAdmins = await db.collection('admins').findOne({ email });

    if (isEmailDuplicateInUsers) {
      return res.status(400).json({ message: 'Email already exists in the InUsers.' });
    }

    if (isEmailDuplicateInAdmins) {
      return res.status(400).json({ message: 'Email already exists in the InAdmins.' });
    }

    const hashedPassword = await hashPassword(password);

    // Handle role change: Move user to admins if role is updated to "admin"
    if (user.role === 'user' && role === 'admin') {
      await db.collection('admins').insertOne({
        _id: user._id,
        username,
        email,
        password: hashedPassword,
        role,
      });
      await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
      return res.json({ message: 'User moved to admins and updated successfully.' });
    }

    // Update user details
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { username, email, password: hashedPassword, role } }
    );

    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// const updateAdmin = async (req, res) => {
//   const adminId = req.params.id;
//   const { username, email, role, password } = req.body;

//   if (!username || !email || !role || !password) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const db = await connectToDatabase();
//     const admin = await db.collection('admins').findOne({ _id: new ObjectId(adminId) });

//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     const hashedPassword = await hashPassword(password);

//     if (admin.role === 'admin' && role === 'user') {
//       await db.collection('users').insertOne({
//         _id: admin._id,
//         username,
//         email,
//         password: hashedPassword,
//         role,
//       });
//       await db.collection('admins').deleteOne({ _id: new ObjectId(adminId) });
//       return res.json({ message: 'Admin moved to users and updated successfully' });
//     }

//     await db.collection('admins').updateOne(
//       { _id: new ObjectId(adminId) },
//       { $set: { username, email, password: hashedPassword, role } }
//     );

//     res.json({ message: 'Admin updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating admin', error: error.message });
//   }
// };

const updateAdmin = async (req, res) => {
  const adminId = req.params.id;
  const { username, email, role, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !role || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await connectToDatabase();
    const admin = await db.collection('admins').findOne({ _id: new ObjectId(adminId) });

    // Check if admin exists
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the email already exists in the admins or users collection (excluding the current admin)
    const isEmailDuplicateInAdmins = await db.collection('admins').findOne({ email });
    const isEmailDuplicateInUsers = await db.collection('users').findOne({ email });

    if (isEmailDuplicateInAdmins ) {
      return res.status(400).json({ message: 'Email already exists in the InAdmins.' });
    }

    if (isEmailDuplicateInUsers) {
      return res.status(400).json({ message: 'Email already exists in the InUsers.' });
    }
    const hashedPassword = await hashPassword(password);

    // Handle role change: Move admin to users if role is updated to "user"
    if (admin.role === 'admin' && role === 'user') {
      await db.collection('users').insertOne({
        _id: admin._id,
        username,
        email,
        password: hashedPassword,
        role,
      });
      await db.collection('admins').deleteOne({ _id: new ObjectId(adminId) });
      return res.json({ message: 'Admin moved to users and updated successfully.' });
    }

    // Update admin details
    await db.collection('admins').updateOne(
      { _id: new ObjectId(adminId) },
      { $set: { username, email, password: hashedPassword, role } }
    );

    res.json({ message: 'Admin updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
    res.json({ message: `User with ID ${userId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    const db = await connectToDatabase();
    const admin = await db.collection('admins').findOne({ _id: new ObjectId(adminId) });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await db.collection('admins').deleteOne({ _id: new ObjectId(adminId) });
    res.json({ message: `Admin with ID ${adminId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};

module.exports = {
  getAdminProfile,
  getAllUsers,
  getAllAdmins,
  updateUser,
  updateAdmin,
  deleteUser,
  deleteAdmin,
};
