const Chanel = require('../models/chanel');
const {
  CREATED,
  badRequestErrorText,
  notFoundFilmErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

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

module.exports = {
  createChanel,
};
