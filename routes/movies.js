const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const BadRequestError = require('../errors/bad-request-err'); // 400

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const methodValidation = (value) => {
  const method = validator.isURL(value, { require_protocol: true });
  if (!method) {
    return new BadRequestError('Введены некорректные данные');
  }
  return value;
};

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(methodValidation, 'validation link'),
    trailer: Joi.string().required().custom(methodValidation, 'validation link'),
    thumbnail: Joi.string().required().custom(methodValidation, 'validation link'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
