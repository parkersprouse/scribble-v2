const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');

const config = require('../config');
const {
  http_ok,
  http_no_content,
  http_bad_request,
  http_server_error
} = require('../config/constants');
const Users = require('../models/users');
const {
  call,
  generateJwtPayload,
  respond
} = require('../utils');

module.exports = {

  /**
   * Gets all of the users.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getAll(req, res, next) {
    const [err, data] = await call(Users.findAll());
    if (err)
      return respond(res, http_server_error, 'Failed to get all users');

    const users = data.map((user) => user.get({ plain: true }));
    respond(res, http_ok, null, users);
  },

  /**
   * Finds a user by ID.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getID(req, res, next) {
    const { id } = req.params;

    const [err, data] = await call(Users.findOne({ where: { id } }));
    if (err)
      return respond(res, http_server_error, 'Failed to get user');
    if (!data)
      return respond(res, http_no_content, 'No user found');

    respond(res, http_ok, null, data);
  },

  /**
   * Finds a user by email address.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getEmail(req, res, next) {
    const { email } = req.params;

    const [err, data] = await call(Users.findOne({
      where: { email: { $iLike: email } }
    }));
    if (err)
      return respond(res, http_server_error, 'Failed to get user');
    if (!data)
      return respond(res, http_no_content, 'No user found');

    respond(res, http_ok, null, data);
  },

  /**
   * Finds all users with a given name.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getName(req, res, next) {
    const { name } = req.params;

    const [err, data] = await call(Users.findAll({
      where: { name: { $iLike: `%${name}%` } }
    }));
    if (err)
      return respond(res, http_server_error, 'Failed to get users');
    if (!data || data.length === 0)
      return respond(res, http_no_content, 'No users found');

    const users = data.map((user) => user.get({ plain: true }));
    respond(res, http_ok, null, users);
  },

  /**
   * Updates a user.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async update(req, res, next) {
    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    const { id, email } = req.body;

    if (email !== undefined && !isEmail(email))
      return respond(res, http_bad_request, 'Your e-mail must be valid');

    const [err, data] = await call(Users.update(
      req.body, { where: { id }, returning: true }
    ));
    if (err)
      return respond(res, http_server_error);
    if (!data[0])
      return respond(res, http_bad_request);

    const user_data = data[1][0].dataValues;

    const payload = generateJwtPayload(user_data);
    const token = jwt.sign(payload, config.jwt_secret);
    respond(res, http_ok, null, { user: user_data, token });
  },

  /**
   * Updates a user's password.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async updatePassword(req, res, next) {
    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    const { id, password_current, password_new, password_new_confirm } = req.body;

    // Check current password
    const [match_err, match_data] = await call(Users.findOne({ where: { id } }));
    if (match_err || !match_data)
      return respond(res, http_server_error);

    const match = bcrypt.compareSync(password_current, match_data.pw_hash);
    if (!match)
      return respond(res, http_bad_request, 'Current password incorrect');
    // End check current password

    else if (!password_new || password_new !== password_new_confirm)
      return respond(res, http_bad_request, 'Passwords did not match');
    else if (password_new.length < 8)
      return respond(res, http_bad_request, 'Password must be at least 8 characters');

    const salt = bcrypt.genSaltSync();
    const pw_hash = bcrypt.hashSync(password_new, salt);
    const [err, data] = await call(Users.update(
      { pw_hash }, { where: { id }, returning: true }
    ));
    if (err || !data[0])
      return respond(res, http_server_error);

    const user_data = data[1][0].dataValues;
    const payload = generateJwtPayload(user_data);
    const token = jwt.sign(payload, config.jwt_secret);
    respond(res, http_ok, null, { user: user_data, token });
  },

  /**
   * Deletes a user.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async delete(req, res, next) {
    const { id } = req.body;

    const [err, data] = await call(Users.destroy({ where: { id } }));
    if (err)
      return respond(res, http_server_error, 'Failed to delete user');
    if (data < 1)
      return respond(res, http_bad_request, 'No user deleted, check provided ID');

    respond(res, http_ok);
  },

  /**
   * Decodes a user's authentication JWT to get the contained information.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async decodeToken(req, res, next) {
    try {
      const decoded = jwt.verify(req.body.token, config.jwt_secret);
      const { email } = decoded;

      const [err] = await call(Users.findOne({
        where: { email: { $iLike: email } }
      }));
      if (err)
        return respond(res, http_bad_request);

      respond(res, http_ok, null, decoded);
    }
    catch(e) {
      respond(res, http_bad_request);
    }
  }

};
