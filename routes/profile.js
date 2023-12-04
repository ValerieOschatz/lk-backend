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
  subscribe,
  unsubsxribe,
} = require('../controllers/users');

const {
  validateUpdateProfileInfo,
  validateUpdateLogin,
  validateUpdatePassword,
  validateCheckUser,
} = require('../middlewares/validators');

profileRoutes.get('/me', getProfile);
profileRoutes.patch('/photo', upload.single('image'), updatePhoto);
profileRoutes.patch('/info', validateUpdateProfileInfo, updateProfileInfo);
profileRoutes.patch('/privat-settings', updatePrivatSettings);
profileRoutes.patch('/login', validateUpdateLogin, updateLogin);
profileRoutes.patch('/password', validateUpdatePassword, updatePassword);
profileRoutes.put('/subscribe', validateCheckUser, subscribe);
profileRoutes.delete('/subscribe', validateCheckUser, unsubsxribe);

module.exports = profileRoutes;
