const express = require('express');

const chanelsRoutes = express.Router();

const { createChanel, getChanelList } = require('../controllers/chanels');

const {
  validateCreateChanel,
} = require('../middlewares/validators');

chanelsRoutes.post('/create', validateCreateChanel, createChanel);
chanelsRoutes.get('/list', getChanelList);

module.exports = chanelsRoutes;
