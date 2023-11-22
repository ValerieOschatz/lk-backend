const express = require('express');
const upload = require('../middlewares/upload');

const chanelsRoutes = express.Router();

const {
  createPost,
} = require('../controllers/posts');

const {
} = require('../middlewares/validators');

chanelsRoutes.post('/create', upload.array('image'), createPost);
// chanelsRoutes.get('/list', getChanelList);
// chanelsRoutes.get('/card', getChanelCard);
// chanelsRoutes.patch('/photo', upload.single('image'), updatePhoto);
// chanelsRoutes.patch('/info', validateUpdateChanelInfo, updateChanelInfo);
// chanelsRoutes.patch('/privat-settings', validateUpdateChanelPrivatSettigs, updatePrivatSettings);
// chanelsRoutes.put('/subscribe', validateCheckChanel, subscribe);
// chanelsRoutes.delete('/subscribe', validateCheckChanel, unsubsxribe);
// chanelsRoutes.delete('/delete', validateCheckChanel, deleteChanel);

module.exports = chanelsRoutes;
