const express = require('express');

const usersRoutes = express.Router();

const { getUsers } = require('../controllers/users');

usersRoutes.get('/list', getUsers);

module.exports = usersRoutes;
