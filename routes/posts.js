const express = require('express');
const upload = require('../middlewares/upload');

const postRoutes = express.Router();

const {
  createPost,
  getPostList,
  getPostCard,
  updatePostText,
  addLike,
  removeLike,
  deletePost,
} = require('../controllers/posts');

postRoutes.post('/create', upload.single('image'), createPost);
postRoutes.get('/list', getPostList);
postRoutes.get('/card', getPostCard);
postRoutes.patch('/text', updatePostText);
postRoutes.put('/like', addLike);
postRoutes.delete('/like', removeLike);
postRoutes.delete('/delete', deletePost);

module.exports = postRoutes;
