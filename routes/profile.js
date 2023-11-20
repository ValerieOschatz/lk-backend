const express = require('express');
const upload = require('../middlewares/upload');

const profileRoutes = express.Router();

const { getProfile, updatePhoto } = require('../controllers/users');
// const {
//   validateRegister,
//   validateLogin,
// } = require('../middlewares/validators');

profileRoutes.get('/me', getProfile);
profileRoutes.post('/upload', upload.single('image'), updatePhoto);

module.exports = profileRoutes;
