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
  subscribe,
  unsubsxribe,
  deleteChanel,
} = require('../controllers/chanels');

const {
  validateUpdateChanelInfo,
  validateCheckChanel,
} = require('../middlewares/validators');

chanelsRoutes.post('/create', createChanel);
chanelsRoutes.get('/list', getChanelList);
chanelsRoutes.get('/card', getChanelCard);
chanelsRoutes.patch('/photo', upload.single('image'), updatePhoto);
chanelsRoutes.patch('/info', validateUpdateChanelInfo, updateChanelInfo);
chanelsRoutes.patch('/privat-settings', updatePrivatSettings);
chanelsRoutes.put('/subscribe', validateCheckChanel, subscribe);
chanelsRoutes.delete('/subscribe', validateCheckChanel, unsubsxribe);
chanelsRoutes.delete('/delete', validateCheckChanel, deleteChanel);

module.exports = chanelsRoutes;
