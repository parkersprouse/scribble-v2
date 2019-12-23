const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');

const { cookie_token, http_bad_request, http_unauthorized } = require('../config/constants');
const config = require('../config');
const User = require('../models/user');

module.exports = {

  buildToken(id) {
    return jwt.sign({ id }, config.jwt_secret);
  },

  call(promise) {
    return promise
      .then((data) => [null, data])
      .catch((err) => {
        Sentry.captureException(err);
        return [err];
      });
  },

  respond(res, status, message, content) {
    res.status(status).json({ message, content });
  },

  validateParams(req, res, next) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return module.exports.respond(res, http_bad_request, validation_errs.array()[0].msg);
    }
    next();
  },

  async verifyToken(req, res, next) {
    const unauthorized = () => {
      res.clearCookie(cookie_token);
      res.sendStatus(http_unauthorized);
    };

    const { token } = req.signedCookies;
    if (token) {
      try {
        const verified = jwt.verify(token, config.jwt_secret);
        const [err, data] = await module.exports.call(User.findOne({ where: { id: verified.id } }));
        if (err || !data) return unauthorized();
        req.current_user = data.dataValues; // pass the logged in user's data to the endpoint resolver
        return next();
      } catch (e) {
        return unauthorized();
      }
    } else {
      return unauthorized();
    }
  },

};
