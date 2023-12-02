const Post = require('../models/post');
const {
  CREATED,
  badRequestErrorText,
  notFoundErrorText,
  forbiddenErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createPost = async (req, res, next) => {
  try {
    const {
      text,
      ownerChanel,
    } = req.body;

    const owner = req.user._id;
    const createdAt = Date.now();
    const photo = req.file && req.file.path.split('\\').join('/');

    const post = await Post.create({
      text,
      photo,
      ownerChanel,
      owner,
      createdAt,
    });

    return res.status(CREATED).send(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const getPostList = async (req, res, next) => {
  try {
    let posts = await Post.find({}).populate(['owner', 'ownerChanel']);
    posts.reverse();

    if (req.query.owner) {
      posts = posts.filter((item) => !item.ownerChanel
      && item.owner._id.toString() === req.query.owner);
    }

    if (req.query.ownerChanel) {
      posts = posts.filter((item) => item.ownerChanel
      && item.ownerChanel._id.toString() === req.query.ownerChanel);
    }

    return res.send(posts);
  } catch (err) {
    return next(err);
  }
};

const getPostCard = async (req, res, next) => {
  try {
    const post = await Post.findById(req.query.postId).populate(['owner', 'ownerChanel']);
    if (!post) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updatePostText = async (req, res, next) => {
  try {
    const { postId, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (post.owner.toString() === req.user._id) {
      await post.updateOne(
        { text },
        { new: true, runValidators: true },
      );
      return res.send(post);
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const addLike = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.query.postId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!post) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.query.postId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!post) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(post);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.query.postId);
    if (!post) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (post.owner.toString() === req.user._id) {
      await post.deleteOne();
      return res.send('Пост успешно удален');
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

module.exports = {
  createPost,
  getPostList,
  getPostCard,
  updatePostText,
  addLike,
  removeLike,
  deletePost,
};
