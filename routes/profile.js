const express = require('express');

const profileRoutes = express.Router();

const { getProfile } = require('../controllers/users');
// const {
//   validateRegister,
//   validateLogin,
// } = require('../middlewares/validators');

profileRoutes.get('/me', getProfile);

module.exports = profileRoutes;
