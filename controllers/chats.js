const Chat = require('../models/chat');
const Message = require('../models/message');
const { sortByTime } = require('../middlewares/sort');

const {
  CREATED,
  badRequestErrorText,
  notFoundErrorText,
  forbiddenErrorText,
  conflictErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ConflictError = require('../errors/ConflictError');

const createChat = async (req, res, next) => {
  try {
    const {
      name,
      otherParticipants,
      isGroup,
      rights,
    } = req.body;

    const createdAt = Date.now();
    const creator = req.user._id;
    const participants = [...otherParticipants, creator];

    if (!isGroup) {
      const currentChat = await Chat.findOne({ participants });
      if (currentChat) throw new ConflictError(conflictErrorText);
    }

    const chat = await Chat.create({
      name,
      participants,
      createdAt,
      groupDetails: {
        isGroup,
        rights,
        creator,
      },
    });

    return res.status(CREATED).send(chat);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const getChatList = async (req, res, next) => {
  try {
    let chats = await Chat.find({}).populate('participants');

    // eslint-disable-next-line max-len
    chats = chats.filter((item) => item.participants.find((el) => el._id.toString() === req.user._id));

    chats = sortByTime(chats);
    return res.send(chats);
  } catch (err) {
    return next(err);
  }
};

const checkChat = async (req, res, next) => {
  try {
    const chats = await Chat.find({});

    const chat = chats.find((item) => !item.groupDetails.isGroup
      && item.participants.find((el) => el._id.toString() === req.user._id)
      && item.participants.find((el) => el._id.toString() === req.query.participant));

    return res.send(chat);
  } catch (err) {
    return next(err);
  }
};

const getChatCard = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.query.chatId).populate('participants');
    if (!chat) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(chat);
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
    const chat = await Chat.findById(req.query.chatId);
    if (!chat || !chat.groupDetails.isGroup) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chat.groupDetails.rights && chat.groupDetails.creator !== req.user._id) {
      throw new ForbiddenError(forbiddenErrorText);
    }
    await chat.updateOne(
      { photo },
      { new: true, runValidators: true },
    );
    return res.send(chat);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateChatName = async (req, res, next) => {
  try {
    const { chatId, name } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.groupDetails.isGroup) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chat.groupDetails.rights && chat.groupDetails.creator !== req.user._id) {
      throw new ForbiddenError(forbiddenErrorText);
    }
    await chat.updateOne(
      { name },
      { new: true, runValidators: true },
    );
    return res.send(chat);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateRights = async (req, res, next) => {
  try {
    const { chatId, rights } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.groupDetails.isGroup) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chat.groupDetails.creator.toString() === req.user._id) {
      await chat.updateOne(
        {
          groupDetails: {
            rights,
            creator: chat.groupDetails.creator,
            isGroup: chat.groupDetails.isGroup,
          },
        },
        { new: true, runValidators: true },
      );
      return res.send(chat);
    }
    throw new ForbiddenError(forbiddenErrorText);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const addParticipant = async (req, res, next) => {
  try {
    const { chatId, participant } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.groupDetails.isGroup) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chat.groupDetails.rights && chat.groupDetails.creator !== req.user._id) {
      throw new ForbiddenError(forbiddenErrorText);
    }
    await chat.updateOne(
      { $addToSet: { participants: participant } },
      { new: true, runValidators: true },
    );
    return res.send(chat);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const removeParticipant = async (req, res, next) => {
  try {
    const { chatId, participant } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.groupDetails.isGroup) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (chat.groupDetails.rights && chat.groupDetails.creator !== req.user._id) {
      throw new ForbiddenError(forbiddenErrorText);
    }
    await chat.updateOne(
      { $pull: { participants: participant } },
      { new: true, runValidators: true },
    );
    return res.send(chat);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.query.chatId);
    if (!chat) {
      throw new NotFoundError(notFoundErrorText);
    }
    if (!chat.groupDetails.isGroup && chat.participants.includes(req.user._id)) {
      await Message.deleteMany({ chat: req.query.chatId });
      await chat.deleteOne();
      return res.send('Объект успешно удален');
    }
    if (chat.groupDetails.isGroup && chat.groupDetails.creator.toString() === req.user._id) {
      await Message.deleteMany({ chat: req.query.chatId });
      await chat.deleteOne();
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
  createChat,
  getChatList,
  checkChat,
  getChatCard,
  updatePhoto,
  updateChatName,
  updateRights,
  addParticipant,
  removeParticipant,
  deleteChat,
};
