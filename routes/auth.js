const express = require('express');

const authRoutes = express.Router();

const { register, loginProfile } = require('../controllers/users');
const {
  validateRegister,
  validateLogin,
} = require('../middlewares/validators');

authRoutes.post('/register', validateRegister, register);
authRoutes.post('/login', validateLogin, loginProfile);

module.exports = authRoutes;
