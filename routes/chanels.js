const express = require('express');
const upload = require('../middlewares/upload');

const chanelsRoutes = express.Router();

const {
  createChanel,
  getChanelList,
  getChanelCard,
  updatePhoto,
} = require('../controllers/chanels');

const {
  validateCreateChanel,
} = require('../middlewares/validators');

chanelsRoutes.post('/create', validateCreateChanel, createChanel);
chanelsRoutes.get('/list', getChanelList);
chanelsRoutes.get('/card', getChanelCard);
chanelsRoutes.patch('/photo', upload.single('image'), updatePhoto);

module.exports = chanelsRoutes;
