const Message = require('../models/message');
const Chat = require('../models/chat');

const {
  CREATED,
  badRequestErrorText,
  notFoundErrorText,
  forbiddenErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMessage = async (req, res, next) => {
  try {
    const {
      text,
      chat,
      answerTo,
    } = req.body;

    const sender = req.user._id;
    const createdAt = Date.now();
    const currentChat = await Chat.findById(chat);
    if (!currentChat) {
      throw new NotFoundError(notFoundErrorText);
    }

    const message = await Message.create({
      text,
      chat,
      answerTo,
      sender,
      createdAt,
    });

    await currentChat.updateOne(
      { updatedAt: createdAt },
      { new: true, runValidators: true },
    );

    global.io.to(message.chat.toString()).emit('chatMessage');
    return res.status(CREATED).send(message);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const getMessageList = async (req, res, next) => {
  try {
    let messages = await Message.find({}).populate(['sender', 'answerTo']);
    messages = messages.filter((item) => item.chat.toString() === req.query.chat);
    messages.reverse();

    return res.send(messages);
  } catch (err) {
    return next(err);
  }
};

const getMessageCard = async (req, res, next) => {
  try {
    const message = await Message.findById(req.query.messageId).populate('sender');
    if (!message) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(message);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const { messageId, text } = req.body;
    const message = await Message.findById(messageId);
    const isUpdated = true;
    if (!message) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (message.sender.toString() === req.user._id) {
      await message.updateOne(
        { text, isUpdated },
        { new: true, runValidators: true },
      );

      global.io.to(message.chat.toString()).emit('chatMessage');
      return res.send(message);
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.query.messageId);
    if (!message) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (message.sender.toString() === req.user._id) {
      await message.deleteOne();
      global.io.to(message.chat.toString()).emit('chatMessage');
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
  createMessage,
  getMessageList,
  getMessageCard,
  updateMessage,
  deleteMessage,
};
