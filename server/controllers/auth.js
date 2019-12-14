const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const config = require('../config');
const Users = require('../models/users');
const {
  db_err_duplicate,
  http_ok,
  http_bad_request,
  http_server_error
} = require('../config/constants');
const {
  call,
  generateJwtPayload,
  respond,
  tokenValid
} = require('../utils');

module.exports = {

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
      return respond(res, http_bad_request, 'Please make sure all required fields are filled out');

    const [err, data] = await call(Users.findOne({ where: { email: { $iLike: email } } }));
    if (err)
      return respond(res, http_server_error, 'There was an unknown problem when trying to log you in', err.message);
    if (!data)
      return respond(res, http_bad_request, 'Your e-mail or password was incorrect');

    const match = bcrypt.compareSync(password, data.pw_hash);
    if (match) {
      const payload = generateJwtPayload(data);
      const token = jwt.sign(payload, config.jwt_secret);
      return respond(res, http_ok, null, token);
    }

    respond(res, http_bad_request, 'Your e-mail or password was incorrect');
  },

  async register(req, res) {
    const { confirm_password, email, name, password } = req.body;
    if (!email || !password || !confirm_password)
      return respond(res, http_bad_request, 'Please make sure all required fields are filled out');
    else if (!isEmail(email))
      return respond(res, http_bad_request, 'Please make sure your e-mail is valid');
    else if (password !== confirm_password)
      return respond(res, http_bad_request, 'Please make sure the passwords match');
    else if (password.length < 8)
      return respond(res, http_bad_request, 'Password must be at least 8 characters');

    const salt = bcrypt.genSaltSync();
    const pw_hash = bcrypt.hashSync(password, salt);
    const [err, data] = await call(Users.create({ name, email, pw_hash }));
    if (err) {
      let message = 'There was an unknown problem when creating your account';
      if (err.name === db_err_duplicate)
        message = 'An account with that e-mail address already exists';
      return respond(res, http_bad_request, message);
    }

    const payload = generateJwtPayload(data);
    const token = jwt.sign(payload, config.jwt_secret);
    respond(res, http_ok, null, token);
  },

  async verifyToken(req, res) {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, config.jwt_secret);
      const [err, data] = await call(Users.findOne({ where: { id: decoded.id } }));
      if (err || !data || !tokenValid(decoded, data))
        return respond(res, http_bad_request);

      respond(res, http_ok);
    }
    catch(err) {
      respond(res, http_bad_request);
    }
  }

};
