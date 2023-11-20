const regex = /^([\w]+)$/;
const CREATED = 201;
const badRequestErrorText = 'Переданы некорректные данные';
const conflictErrorText = 'Пользователь с этим login уже существует';

module.exports = {
  regex,
  CREATED,
  badRequestErrorText,
  conflictErrorText,
};
