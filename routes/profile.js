const express = require('express');
const upload = require('../middlewares/upload');

const profileRoutes = express.Router();

const { getProfile, updatePhoto, updateProfileInfo } = require('../controllers/users');
const {
  validateUpdateProfileInfo,
} = require('../middlewares/validators');

profileRoutes.get('/me', getProfile);
profileRoutes.patch('/photo', upload.single('image'), updatePhoto);
profileRoutes.patch('/info', validateUpdateProfileInfo, updateProfileInfo);

module.exports = profileRoutes;
