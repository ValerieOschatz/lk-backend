const express = require('express');

const authRoutes = express.Router();

const {
  register,
  loginProfile,
  logout,
} = require('../controllers/users');
const {
  validateRegister,
  validateLogin,
} = require('../middlewares/validators');

authRoutes.post('/register', validateRegister, register);
authRoutes.post('/login', validateLogin, loginProfile);
authRoutes.get('/logout', logout);

module.exports = authRoutes;
