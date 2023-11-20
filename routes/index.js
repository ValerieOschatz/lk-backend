const express = require('express');

const routes = express.Router();
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const usersRoutes = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

routes.use('/auth', authRoutes);
routes.use(auth);
routes.use('/profile', profileRoutes);
routes.use('/user', usersRoutes);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = routes;
