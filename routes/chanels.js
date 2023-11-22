const express = require('express');
const upload = require('../middlewares/upload');

const chanelsRoutes = express.Router();

const {
  createChanel,
  getChanelList,
  getChanelCard,
  updatePhoto,
  updateChanelInfo,
  updatePrivatSettings,
} = require('../controllers/chanels');

const {
  validateCreateChanel,
  validateUpdateChanelInfo,
  validateUpdateChanelPrivatSettigs,
} = require('../middlewares/validators');

chanelsRoutes.post('/create', validateCreateChanel, createChanel);
chanelsRoutes.get('/list', getChanelList);
chanelsRoutes.get('/card', getChanelCard);
chanelsRoutes.patch('/photo', upload.single('image'), updatePhoto);
chanelsRoutes.patch('/info', validateUpdateChanelInfo, updateChanelInfo);
chanelsRoutes.patch('/privat-settings', validateUpdateChanelPrivatSettigs, updatePrivatSettings);

module.exports = chanelsRoutes;
