const express = require('express');

const routes = express.Router();
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const usersRoutes = require('./users');
const chanelsRoutes = require('./chanels');
const postsRoutes = require('./posts');
const commentsRoutes = require('./comments');
const chatsRoutes = require('./chats');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

routes.use('/auth', authRoutes);
routes.use(auth);
routes.use('/profile', profileRoutes);
routes.use('/user', usersRoutes);
routes.use('/chanel', chanelsRoutes);
routes.use('/post', postsRoutes);
routes.use('/comment', commentsRoutes);
routes.use('/chat', chatsRoutes);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = routes;
