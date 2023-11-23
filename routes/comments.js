const express = require('express');

const commentRoutes = express.Router();

const {
  createComment,
  getCommentList,
  getCommentCard,
  updateComment,
  addLike,
  removeLike,
  deleteComment,
} = require('../controllers/comments');

commentRoutes.post('/create', createComment);
commentRoutes.get('/list', getCommentList);
commentRoutes.get('/card', getCommentCard);
commentRoutes.patch('/update', updateComment);
commentRoutes.put('/like', addLike);
commentRoutes.delete('/like', removeLike);
commentRoutes.delete('/delete', deleteComment);

module.exports = commentRoutes;
