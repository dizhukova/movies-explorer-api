const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { errorMessages } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-err'); // 400
const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-err'); // 409

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(errorMessages.authError));
    });
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt').send({ message: errorMessages.successfulLogout });
  next();
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessages.incorrectDataUserCreate);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(errorMessages.alreadyRegisteredEmail);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(errorMessages.notFoundUserId);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(errorMessages.incorrectData);
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(errorMessages.notFoundUserId);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessages.incorrectDataUserUpdate);
      }
      next(err);
    })
    .catch(next);
};
