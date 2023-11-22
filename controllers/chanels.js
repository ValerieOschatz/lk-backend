/* eslint-disable camelcase */
const Chanel = require('../models/chanel');
const {
  CREATED,
  badRequestErrorText,
  notFoundErrorText,
  forbiddenErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createChanel = async (req, res, next) => {
  try {
    const {
      name,
      description,
    } = req.body;

    const owner = req.user._id;

    const chanel = await Chanel.create({
      name,
      description,
      owner,
    });

    return res.status(CREATED).send(chanel);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const getChanelList = async (req, res, next) => {
  try {
    let chanels = await Chanel.find({});

    if (req.query.subscriptions) {
      chanels = chanels.filter((item) => item.subscribers.includes(req.query.subscriptions));
    }

    if (req.query.name) {
      chanels = chanels.filter((item) => item.name.includes(req.query.name));
    }

    return res.send(chanels);
  } catch (err) {
    return next(err);
  }
};

const getChanelCard = async (req, res, next) => {
  try {
    const chanel = await Chanel.findById(req.query.chanelId);
    if (!chanel) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(chanel);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updatePhoto = async (req, res, next) => {
  try {
    const photo = req.file.path.split('\\').join('/');
    const chanel = await Chanel.findById(req.query.chanelId);
    if (!chanel) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chanel.owner.toString() === req.user._id) {
      const updatedChanel = await Chanel.findByIdAndUpdate(
        req.query.chanelId,
        { photo },
        { new: true, runValidators: true },
      );
      return res.send(updatedChanel);
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateChanelInfo = async (req, res, next) => {
  try {
    const { chanelId, name, description } = req.body;
    const chanel = await Chanel.findById(chanelId);
    if (!chanel) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chanel.owner.toString() === req.user._id) {
      const updatedChanel = await Chanel.findByIdAndUpdate(
        chanelId,
        { name, description },
        { new: true, runValidators: true },
      );
      return res.send(updatedChanel);
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
  createChanel,
  getChanelList,
  getChanelCard,
  updatePhoto,
  updateChanelInfo,
};
