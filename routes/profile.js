const express = require('express');
const upload = require('../middlewares/upload');

const profileRoutes = express.Router();

const {
  getProfile,
  updatePhoto,
  updateProfileInfo,
  updatePrivatSettings,
  updateLogin,
  updatePassword,
} = require('../controllers/users');

const {
  validateUpdateProfileInfo,
  validateUpdatePrivatSettigs,
  validateUpdateLogin,
  validateUpdatePassword,
} = require('../middlewares/validators');

profileRoutes.get('/me', getProfile);
profileRoutes.patch('/photo', upload.single('image'), updatePhoto);
profileRoutes.patch('/info', validateUpdateProfileInfo, updateProfileInfo);
profileRoutes.patch('/privat-settings', validateUpdatePrivatSettigs, updatePrivatSettings);
profileRoutes.patch('/login', validateUpdateLogin, updateLogin);
profileRoutes.patch('/password', validateUpdatePassword, updatePassword);

module.exports = profileRoutes;
