const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const corsMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
const corsHeaders = ['Authorization', 'Content-Type'];

const errorMessages = {
  serverError: 'На сервере произошла ошибка',
  serverCrashError: 'Сервер сейчас упадёт',
  authRequired: 'Необходима авторизация.',
  authError: 'Ошибка аутентификации.',
  notFoundError: 'Ресурс не найден',
  successfulLogout: 'Успешное удаление cookies.',
  incorrectData: 'Переданы некорректные данные.',
  incorrectDataUserCreate: 'Переданы некорректные данные при создании пользователя.',
  incorrectDataUserUpdate: 'Переданы некорректные данные при обновлении профиля.',
  incorrectDataMovieCreate: 'Переданы некорректные данные при создании фильма.',
  notFoundUserId: 'Пользователь c указанному _id не найден.',
  notFoundMovieId: 'Фильм с указанным _id не найден.',
  alreadyRegisteredEmail: 'Этот email уже зарегистрирован.',
  notEnoughRightsMovieDelete: 'Недостаточно прав для удаления фильма.',
};

module.exports = {
  PORT,
  DB_URL,
  corsMethods,
  corsHeaders,
  errorMessages,
};
