const connectToDatabase = require('../config/database');
const { hashPassword } = require('../models/helpers');
const {getAdminById} = require('../models/adminModel');

const getAdminProfile = async (req, res) => {
    try {
      const admin = await getAdminById(req.user.id);
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
    const connection = await connectToDatabase();
    const [users] = await connection.execute('SELECT id, username, email, role FROM users');
    res.json({ message: 'All users data', users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users data', error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [admins] = await connection.execute('SELECT id, username, email, role FROM admins');
    res.json({ message: 'All admins data', admins });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admins data', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, role, password } = req.body;

  if (!username || !email || !role || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const connection = await connectToDatabase();
    const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await hashPassword(password);

    // If role changes to admin, move the user
    if (user[0].role === 'user' && role === 'admin') {
      await connection.execute(
        'INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [user[0].id, username, email, hashedPassword, role]
      );
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
      return res.json({ message: 'User moved to admins and updated successfully' });
    }

    await connection.execute(
      'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?',
      [username, email, hashedPassword, role, userId]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

const updateAdmin = async (req, res) => {
    const adminId = req.params.id;
    const { username, email, role, password } = req.body;
  
    if (!username || !email || !role || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const connection = await connectToDatabase();
      const [admin] = await connection.execute('SELECT * FROM admins WHERE id = ?', [adminId]);
  
      if (admin.length === 0) {
        return res.status(404).json({ message: 'admin not found' });
      }
  
      const hashedPassword = await hashPassword(password);
  
      // If role changes to admin, move the user
      if (admin[0].role === 'admin' && role === 'user') {
        await connection.execute(
          'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
          [admin[0].id, username, email, hashedPassword, role]
        );
        await connection.execute('DELETE FROM admins WHERE id = ?', [adminId]);
        return res.json({ message: 'admin moved to users and updated successfully' });
      }
  
      await connection.execute(
        'UPDATE admins SET username = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [username, email, hashedPassword, role, adminId]
      );
  
      res.json({ message: 'admin updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  };
  

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const connection = await connectToDatabase();
    const [user] = await connection.execute('SELECT id FROM users WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: `User with ID ${userId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
    const adminId = req.params.id;
  
    try {
      const connection = await connectToDatabase();
      const [admin] = await connection.execute('SELECT id FROM admins WHERE id = ?', [adminId]);
  
      if (admin.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await connection.execute('DELETE FROM admins WHERE id = ?', [adminId]);
      res.json({ message: `admin with ID ${adminId} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
  };

module.exports = { getAdminProfile, getAllUsers, getAllAdmins, updateUser, deleteUser, updateAdmin, deleteAdmin };
