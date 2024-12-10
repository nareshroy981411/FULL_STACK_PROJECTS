const express = require('express');
const { signupAdmin, signupUser, login } = require('../controllers/authController');
// const authController = require('../controllers/authController');

const router = express.Router();

// router.post('/signup', signup);
router.post('/signup/user', signupUser);
router.post('/signup/admin', signupAdmin);
router.post('/login', login);

module.exports = router;
