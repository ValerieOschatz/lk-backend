const regex = /^([\w]+)$/;
const CREATED = 201;
const badRequestErrorText = 'Переданы некорректные данные';
const conflictErrorText = 'Пользователь с этим login уже существует';
const notFoundErrorText = 'Запрашиваемый объект не найден';

module.exports = {
  regex,
  CREATED,
  badRequestErrorText,
  conflictErrorText,
  notFoundErrorText,
};
