const { getUserById } = require('../models/userModel');
const { hashPassword } = require('../models/helpers'); 
const userModel = require('../models/userModel'); 

const getUserProfile = async (req, res) => {
  try {
    // MongoDB: Retrieve user by ObjectId
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User profile', user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // MongoDB: Retrieve user by ObjectId
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User profile', user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    // MongoDB: Hash the password
    const hashedPassword = await hashPassword(password);
    
    // MongoDB: Update user document
    const updateResult = await userModel.updateUser(id, username, email, hashedPassword, role);
    
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

module.exports = { getProfile, updateUser, getUserProfile };
