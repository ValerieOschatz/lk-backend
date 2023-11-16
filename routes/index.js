const express = require('express');

const { register } = require('../controllers/users');
const { validateSignUp } = require('../middlewares/validators');

const routes = express.Router();
// const usersRoutes = require('./users');
const NotFoundError = require('../errors/NotFoundError');

routes.post('/signup', validateSignUp, register);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = routes;
