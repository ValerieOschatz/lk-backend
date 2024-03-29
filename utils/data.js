const regex = /^([\w]+)$/;
const CREATED = 201;
const badRequestErrorText = 'Переданы некорректные данные';
const conflictErrorText = 'Такой объект уже существует';
const notFoundErrorText = 'Запрашиваемый объект не найден';
const forbiddenErrorText = 'Нет доступа';

module.exports = {
  regex,
  CREATED,
  badRequestErrorText,
  conflictErrorText,
  notFoundErrorText,
  forbiddenErrorText,
};
