const express = require('express');
const upload = require('../middlewares/upload');

const chatsRoutes = express.Router();

const {
  createChat,
  getChatList,
  getChatCard,
  updatePhoto,
  updateChatName,
  updateRights,
  addParticipant,
  removeParticipant,
  deleteChat,
} = require('../controllers/chats');

chatsRoutes.post('/create', createChat);
chatsRoutes.get('/list', getChatList);
chatsRoutes.get('/card', getChatCard);
chatsRoutes.patch('/photo', upload.single('image'), updatePhoto);
chatsRoutes.patch('/name', updateChatName);
chatsRoutes.patch('/rights', updateRights);
chatsRoutes.put('/participant', addParticipant);
chatsRoutes.delete('/participant', removeParticipant);
chatsRoutes.delete('/delete', deleteChat);

module.exports = chatsRoutes;
