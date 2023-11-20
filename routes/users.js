const express = require('express');

const usersRoutes = express.Router();

const { getUsers, getUser } = require('../controllers/users');

usersRoutes.get('/list', getUsers);
usersRoutes.get('/card', getUser);

module.exports = usersRoutes;
