const router = require('express').Router();

const usersRoute = require('./users');
const moviesRoute = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserSchema, validateUserLogin } = require('../middlewares/validation');

const NotFoundError = require('../errors/not-found-err'); // 404
const { messages } = require('../utils/constants');

router.post('/signup', validateUserSchema, createUser);
router.post('/signin', validateUserLogin, login);

router.use(auth);

router.delete('/signout', logout);
router.use('/users', usersRoute);
router.use('/movies', moviesRoute);

router.use('*', () => {
  throw new NotFoundError(messages.notFoundError);
});

module.exports = router;
