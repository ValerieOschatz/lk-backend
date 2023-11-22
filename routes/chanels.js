const express = require('express');
const upload = require('../middlewares/upload');

const chanelsRoutes = express.Router();

const {
  createChanel,
  getChanelList,
  getChanelCard,
  updatePhoto,
  updateChanelInfo,
} = require('../controllers/chanels');

const {
  validateCreateChanel,
  validateUpdateChanelInfo,
} = require('../middlewares/validators');

chanelsRoutes.post('/create', validateCreateChanel, createChanel);
chanelsRoutes.get('/list', getChanelList);
chanelsRoutes.get('/card', getChanelCard);
chanelsRoutes.patch('/photo', upload.single('image'), updatePhoto);
chanelsRoutes.patch('/info', validateUpdateChanelInfo, updateChanelInfo);

module.exports = chanelsRoutes;
