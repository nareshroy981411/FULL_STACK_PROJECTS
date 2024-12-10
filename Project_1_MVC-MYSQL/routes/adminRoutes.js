const express = require('express');
const {
  getAllUsers,
  getAllAdmins,
  updateUser,
  deleteUser,
  updateAdmin,
  deleteAdmin,
  getAdminProfile,
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const adminController = require('../controllers/adminController')

const router = express.Router();

router.get('/profile', authMiddleware, getAdminProfile);
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.get('/admins', authMiddleware, roleMiddleware('admin'), getAllAdmins);
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.put('/admins/:id', authMiddleware, roleMiddleware('admin'), updateAdmin);
router.delete('/admins/:id', authMiddleware, roleMiddleware('admin'), deleteAdmin);

module.exports = router;
