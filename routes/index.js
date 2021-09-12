const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRoute = require('./users');
const moviesRoute = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-err'); // 404

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.delete('/signout', logout);

router.use(auth);

router.use('/users', usersRoute);
router.use('/movies', moviesRoute);

router.use('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

module.exports = router;
