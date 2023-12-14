const Chanel = require('../models/chanel');
const { sortByName } = require('../middlewares/sort');
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
    const createdAt = Date.now();

    const chanel = await Chanel.create({
      name,
      description,
      owner,
      createdAt,
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

    if (req.query.owner) {
      chanels = chanels.filter((item) => item.owner.toString() === req.query.owner);
    }

    if (req.query.subscriptions) {
      chanels = chanels.filter((item) => item.subscribers.includes(req.query.subscriptions));
    }

    if (req.query.name) {
      chanels = chanels.filter((item) => item.name.includes(req.query.name));
    }
    chanels = sortByName(chanels);

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
    const photo = req.file && req.file.filename;
    const chanel = await Chanel.findById(req.query.chanelId);
    if (!chanel) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chanel.owner.toString() === req.user._id) {
      await chanel.updateOne(
        { photo },
        { new: true, runValidators: true },
      );
      return res.send(chanel);
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
      await chanel.updateOne(
        { name, description },
        { new: true, runValidators: true },
      );
      return res.send(chanel);
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updatePrivatSettings = async (req, res, next) => {
  try {
    const {
      chanelId,
      comments,
      posts,
    } = req.body;

    const chanel = await Chanel.findById(chanelId);
    if (!chanel) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chanel.owner.toString() === req.user._id) {
      await chanel.updateOne(
        {
          privatSettings: {
            comments,
            posts,
          },
        },
        { new: true, runValidators: true },
      );
      return res.send(chanel);
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const chanel = await Chanel.findByIdAndUpdate(
      req.query.chanelId,
      { $addToSet: { subscribers: req.user._id } },
      { new: true },
    );
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

const unsubsxribe = async (req, res, next) => {
  try {
    const chanel = await Chanel.findByIdAndUpdate(
      req.query.chanelId,
      { $pull: { subscribers: req.user._id } },
      { new: true },
    );
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

const deleteChanel = async (req, res, next) => {
  try {
    const chanel = await Chanel.findById(req.query.chanelId);
    if (!chanel) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chanel.owner.toString() === req.user._id) {
      await chanel.deleteOne();
      return res.send('Канал успешно удален');
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
  updatePrivatSettings,
  subscribe,
  unsubsxribe,
  deleteChanel,
};
