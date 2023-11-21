const express = require('express');
const upload = require('../middlewares/upload');

const profileRoutes = express.Router();

const {
  getProfile,
  updatePhoto,
  updateProfileInfo,
  updatePrivatSettings,
} = require('../controllers/users');

const {
  validateUpdateProfileInfo,
  validateUpdatePrivatSettigs,
} = require('../middlewares/validators');

profileRoutes.get('/me', getProfile);
profileRoutes.patch('/photo', upload.single('image'), updatePhoto);
profileRoutes.patch('/info', validateUpdateProfileInfo, updateProfileInfo);
profileRoutes.patch('/privat-settings', validateUpdatePrivatSettigs, updatePrivatSettings);

module.exports = profileRoutes;
