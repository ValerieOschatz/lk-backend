const express = require('express');

const routes = express.Router();
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const usersRoutes = require('./users');
const chanelsRoutes = require('./chanels');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

routes.use('/auth', authRoutes);
routes.use(auth);
routes.use('/profile', profileRoutes);
routes.use('/user', usersRoutes);
routes.use('/chanel', chanelsRoutes);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = routes;
