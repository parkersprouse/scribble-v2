const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {
  http_ok,
  http_no_content,
  http_bad_request,
  http_server_error,
} = require('../config/constants');
const Users = require('../models/user');
const {
  call,
  generateJwtPayload,
  respond,
} = require('../lib');

module.exports = {

  async getAll(req, res) {
    const [err, data] = await call(Users.findAll());
    if (err) return respond(res, http_server_error, 'Failed to get all users');

    const users = data.map((user) => user.get({ plain: true }));
    return respond(res, http_ok, null, users);
  },

  async getID(req, res) {
    const { id } = req.params;

    const [err, data] = await call(Users.findOne({ where: { id } }));
    if (err) return respond(res, http_server_error, 'Failed to get user');
    if (!data) return respond(res, http_no_content, 'No user found');

    return respond(res, http_ok, null, data);
  },

  async getEmail(req, res) {
    const { email } = req.params;

    const [err, data] = await call(Users.findOne({
      where: { email: { [Op.iLike]: email } },
    }));
    if (err) return respond(res, http_server_error, 'Failed to get user');
    if (!data) return respond(res, http_no_content, 'No user found');

    return respond(res, http_ok, null, data);
  },

  async getName(req, res) {
    const { name } = req.params;

    const [err, data] = await call(Users.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
    }));
    if (err) return respond(res, http_server_error, 'Failed to get users');
    if (!data || data.length === 0) return respond(res, http_no_content, 'No users found');

    const users = data.map((user) => user.get({ plain: true }));
    return respond(res, http_ok, null, users);
  },

  async update(req, res) {
    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    const { id, email } = req.body;

    if (email !== undefined && !isEmail(email)) {
      return respond(res, http_bad_request, 'Your e-mail must be valid');
    }

    const [err, data] = await call(Users.update(
      req.body, { where: { id }, returning: true },
    ));
    if (err) return respond(res, http_server_error);
    if (!data[0]) return respond(res, http_bad_request);

    const user_data = data[1][0].dataValues;

    const payload = generateJwtPayload(user_data);
    const token = jwt.sign(payload, config.jwt_secret);
    return respond(res, http_ok, null, { user: user_data, token });
  },

  async updatePassword(req, res) {
    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    const {
      id, password_current, password_new, password_new_confirm,
    } = req.body;

    // Check current password
    const [match_err, match_data] = await call(Users.findOne({ where: { id } }));
    if (match_err || !match_data) return respond(res, http_server_error);

    const match = bcrypt.compareSync(password_current, match_data.pw_hash);
    if (!match) return respond(res, http_bad_request, 'Current password incorrect');
    // End check current password

    if (!password_new || password_new !== password_new_confirm) {
      return respond(res, http_bad_request, 'Passwords did not match');
    }
    if (password_new.length < 8) {
      return respond(res, http_bad_request, 'Password must be at least 8 characters');
    }

    const salt = bcrypt.genSaltSync();
    const pw_hash = bcrypt.hashSync(password_new, salt);
    const [err, data] = await call(Users.update(
      { pw_hash }, { where: { id }, returning: true },
    ));
    if (err || !data[0]) return respond(res, http_server_error);

    const user_data = data[1][0].dataValues;
    const payload = generateJwtPayload(user_data);
    const token = jwt.sign(payload, config.jwt_secret);
    return respond(res, http_ok, null, { user: user_data, token });
  },

  async delete(req, res) {
    const { id } = req.body;

    const [err, data] = await call(Users.destroy({ where: { id } }));
    if (err) return respond(res, http_server_error, 'Failed to delete user');
    if (data < 1) return respond(res, http_bad_request, 'No user deleted, check provided ID');

    return respond(res, http_ok);
  },

  async decodeToken(req, res) {
    try {
      const decoded = jwt.verify(req.body.token, config.jwt_secret);
      const { email } = decoded;

      const [err] = await call(Users.findOne({
        where: { email: { [Op.iLike]: email } },
      }));
      if (err) return respond(res, http_bad_request);

      return respond(res, http_ok, null, decoded);
    } catch (e) {
      return respond(res, http_bad_request);
    }
  },

};
