const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const { errorMessages } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError(errorMessages.authRequired));
  }

  req.user = payload;

  next();
};
