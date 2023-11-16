const regex = /^([\w]+)$/;
const CREATED = 201;
const badRequestErrorText = 'Переданы некорректные данные';
const conflictErrorText = 'Пользователь с этим email уже существует';

module.exports = {
  regex,
  CREATED,
  badRequestErrorText,
  conflictErrorText,
};
