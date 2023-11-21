const express = require('express');

const chanelsRoutes = express.Router();

const { createChanel } = require('../controllers/chanels');

const {
  validateCreateChanel,
} = require('../middlewares/validators');

chanelsRoutes.post('/create', validateCreateChanel, createChanel);

module.exports = chanelsRoutes;
