const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { Op } = require('../config/db');
const User = require('../models/user');
const {
  cookie_token,
  db_err_duplicate,
  http_ok,
  http_bad_request,
  http_server_error,
} = require('../config/constants');
const { buildToken, call, respond } = require('../lib');

module.exports = {

  async login(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const { email, password } = req.body;
    const [err, data] = await call(User.findOne({ where: { email: { [Op.iLike]: email } } }));
    if (err) {
      return respond(res, http_server_error,
        'There was an unknown problem trying to log you in', err.message);
    }
    if (!data) {
      return respond(res, http_bad_request, 'Your e-mail or password was incorrect');
    }

    const match = bcrypt.compareSync(password, data.pw_hash);
    if (!match) {
      return respond(res, http_bad_request, 'Your e-mail or password was incorrect');
    }

    res.cookie(cookie_token, buildToken(data.id), {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
    });
    respond(res, http_ok);
  },

  logout(req, res) {
    res.clearCookie(cookie_token);
    respond(res, http_ok);
  },

  async register(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const { email, name, password } = req.body;
    const salt = bcrypt.genSaltSync();
    const pw_hash = bcrypt.hashSync(password, salt);
    const [err, data] = await call(User.create({ name, email, pw_hash }));
    if (err) {
      const msg = err.name === db_err_duplicate
        ? 'An account with that e-mail address already exist'
        : 'There was an unknown problem creating your account';
      return respond(res, http_bad_request, msg);
    }

    res.cookie(cookie_token, buildToken(data.id), {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
    });
    respond(res, http_ok);
  },

};
