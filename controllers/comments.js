const Comment = require('../models/comment');
const {
  CREATED,
  badRequestErrorText,
  notFoundErrorText,
  forbiddenErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createComment = async (req, res, next) => {
  try {
    const {
      text,
      post,
      answerTo,
    } = req.body;

    const owner = req.user._id;
    const createdAt = Date.now();

    const comment = await Comment.create({
      text,
      post,
      answerTo,
      owner,
      createdAt,
    });

    return res.status(CREATED).send(comment);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const getCommentList = async (req, res, next) => {
  try {
    let comments = await Comment.find({}).populate(['owner', 'answerTo']);
    comments.reverse();

    if (req.query.post) {
      comments = comments.filter((item) => item.post._id.toString() === req.query.post);
    }

    return res.send(comments);
  } catch (err) {
    return next(err);
  }
};

const getCommentCard = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.query.commentId).populate(['owner', 'answerTo']);
    if (!comment) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(comment);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { commentId, text } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (comment.owner.toString() === req.user._id) {
      await comment.updateOne(
        { text },
        { new: true, runValidators: true },
      );
      return res.send(comment);
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
    const comment = await Comment.findByIdAndUpdate(
      req.body.commentId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!comment) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(comment);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.query.commentId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!comment) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(comment);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.query.commentId);
    if (!comment) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (comment.owner.toString() === req.user._id) {
      await comment.deleteOne();
      return res.send('Объект успешно удален');
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
  createComment,
  getCommentList,
  getCommentCard,
  updateComment,
  addLike,
  removeLike,
  deleteComment,
};
