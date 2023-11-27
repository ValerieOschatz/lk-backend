const express = require('express');

const messagesRoutes = express.Router();

const {
  createMessage,
  getMessageList,
  getMessageCard,
  updateMessage,
  deleteMessage,
} = require('../controllers/messages');

messagesRoutes.post('/create', createMessage);
messagesRoutes.get('/list', getMessageList);
messagesRoutes.get('/card', getMessageCard);
messagesRoutes.patch('/update', updateMessage);
messagesRoutes.delete('/delete', deleteMessage);

module.exports = messagesRoutes;
