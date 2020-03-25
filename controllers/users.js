const bcrypt = require('bcrypt');
const {
  http_ok,
  http_no_content,
  http_bad_request,
  http_server_error,
} = require('../config/constants');
const { call, respond } = require('../lib');
const Users = require('../models/user');

module.exports = {

  async delete(req, res) {
    const [err, data] = await call(Users.destroy({ where: { id: req.body.id } }));
    if (err) return respond(res, http_server_error, 'Failed to delete user');
    if (data < 1) return respond(res, http_bad_request, 'No user deleted, check provided ID');

    return respond(res, http_ok);
  },

  async getAll(req, res) {
    const [err, data] = await call(Users.findAll());
    if (err) return respond(res, http_server_error, 'Failed to get all users');

    const users = data.map((user) => user.get({ plain: true }));
    respond(res, http_ok, null, users);
  },

  async getID(req, res) {
    const [err, data] = await call(Users.findOne({ where: { id: req.params.id } }));
    if (err) return respond(res, http_server_error, 'Failed to get user');
    if (!data) return respond(res, http_no_content, 'No user found');

    respond(res, http_ok, null, data);
  },

  getMe(req, res, next) {
    req.params.id = req.current_user.id;
    module.exports.getID(req, res, next);
  },

  async update(req, res) {
    const { id } = req.current_user;
    const { password_current } = req.body;

    // Check current password
    const [match_err, match_data] = await call(Users.findOne({ where: { id } }));
    if (match_err || !match_data) {
      return respond(res, http_server_error, 'There was an unknown problem updating your profile');
    }
    const match = bcrypt.compareSync(password_current, match_data.pw_hash);
    if (!match) return respond(res, http_bad_request, 'Current password incorrect');

    // Update user data
    const [err, data] = await call(Users.update(req.body, { where: { id }, returning: true }));
    if (err || !data[0]) {
      return respond(res, http_server_error, 'There was an unknown problem updating your profile');
    }

    respond(res, http_ok);
  },

  async updatePassword(req, res) {
    const { id } = req.current_user;
    const { password_current, password_new } = req.body;

    // Check current password
    const [match_err, match_data] = await call(Users.findOne({ where: { id } }));
    if (match_err || !match_data) {
      return respond(res, http_server_error, 'There was an unknown problem updating your password');
    }
    const match = bcrypt.compareSync(password_current, match_data.pw_hash);
    if (!match) return respond(res, http_bad_request, 'Current password incorrect');

    // Encrypt new password
    const salt = bcrypt.genSaltSync();
    const pw_hash = bcrypt.hashSync(password_new, salt);
    const [err, data] = await call(Users.update({ pw_hash }, { where: { id }, returning: true }));
    if (err || !data[0]) {
      return respond(res, http_server_error, 'There was an unknown problem updating your password');
    }

    respond(res, http_ok);
  },

};
