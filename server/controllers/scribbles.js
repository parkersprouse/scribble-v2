const moment = require('moment');
const Scribbles = require('../models/scribbles');
const { Sequelize } = require('../config/db');
const { Op } = Sequelize;
const {
  http_ok,
  http_no_content,
  http_bad_request,
  http_server_error
} = require('../config/constants');
const {
  call,
  respond
} = require('../utils');

module.exports = {

  /**
   * Gets all of the scribbles.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getAll(req, res) {
    const [err, data] = await call(Scribbles.findAll());
    if (err)
      return respond(res, http_server_error, 'Failed to get all scribbles', err.message);
    if (!data || data.length === 0)
      return respond(res, http_bad_request, 'No scribbles found');

    const scribbles = data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, scribbles);
  },

  /**
   * Finds a scribble by ID.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getID(req, res) {
    const { id } = req.params;
    const [err, data] = await call(Scribbles.findOne({ where: { id } }));
    if (err)
      return respond(res, http_server_error, 'Failed to get scribbles');
    if (!data)
      return respond(res, http_no_content, 'No scribble found');

    respond(res, http_ok, null, data);
  },

  /**
   * Finds all scribbles owned by the user with the given owner ID.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getOwnerID(req, res) {
    const { owner_id } = req.params;
    const [err, data] = await call(Scribbles.findAll({ where: { owner_id } }));
    if (err)
      return respond(res, http_server_error, 'Failed to get scribbles');
    if (!data || data.length === 0)
      return respond(res, http_no_content, 'No scribbles found');

    const scribbles = data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, scribbles);
  },

  /**
   * Gets all of the tags that the user has used on previously created
   * scribbles.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async getOwnerTags(req, res) {
    const { owner_id } = req.params;

    const [err, data] = await call(Scribbles.findAll({
      where: { owner_id }, attributes: ['tags']
    }));
    if (err)
      return respond(res, http_server_error, 'Failed to get tags');

    let all_tags = [];
    data.forEach(({ tags }) => {
      if (tags) {
        all_tags = all_tags.concat(tags);
      }
    });

    let uniq_tags = [];
    all_tags.forEach(tag => {
      if (uniq_tags.indexOf(tag) === -1) {
        uniq_tags.push(tag);
      }
    });

    uniq_tags.sort();
    respond(res, http_ok, null, uniq_tags);
  },

  /**
   * Creates a new scribble.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async add(req, res) {
    if (!req.body.body)
      return respond(res, http_bad_request, 'Your scribble cannot be empty');
    if (!req.body.title)
      title = moment().format('MM/DD/YYYY h:mma');

    const [err, data] = await call(Scribbles.create(req.body));
    if (err)
      return respond(res, http_server_error, 'Failed to create scribble');

    respond(res, http_ok, null, data);
  },

  /**
   * Updates a scribble.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async update(req, res) {
    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    if (!req.body.body)
      return respond(res, http_bad_request, 'Your scribble cannot be empty');

    const [err, data] = await call(Scribbles.update(req.body, { where: { id: req.body.id }, returning: true }));
    if (err)
      return respond(res, http_server_error, 'Failed to update scribble');
    if (!data[0])
      return respond(res, http_bad_request, 'No scribble updated, check provided ID');

    respond(res, http_ok, null, data[1][0].dataValues);
  },

  /**
   * Deletes a scribble.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async delete(req, res) {
    const [err, data] = await call(Scribbles.destroy({ where: { id: req.params.id } }));
    if (err)
      return respond(res, http_server_error, 'Failed to delete scribble');
    if (data < 1)
      return respond(res, http_bad_request, 'No scribble deleted, check provided ID');

    respond(res, http_ok);
  },

  /**
   * Gets a paginated context of a user's scribbles, taking into consideration
   * any search terms or tags provided to filter by.
   * @function
   * @async
   * @param {object} req - The client's request.
   * @param {object} res - The server's response.
   * @returns {void}
   */
  async filter(req, res) {
    let { page, per, term, tag, owner_id } = req.body;
    if (!page) page = 1;
    if (!per) per = 12;

    const body_search = { body: { $iLike: `%${term}%` } };
    const title_search = { title: { $iLike: `%${term}%` } };
    const search = { [Op.or]: [body_search, title_search] };

    const tag_filter = { tags: { $contains: [tag] } };

    let query = { owner_id };
    if (term)
      query = { ...query, ...search };
    if (tag)
      query = { ...query, ...tag_filter };

    const [all_err, all_data] = await call(Scribbles.findAll({ where: query }));
    const [pagi_err, pagi_data] = await call(Scribbles.findAll({
      where: query, limit: per, offset: (page - 1) * per, order: ['created_at']
    }));
    if (all_err || pagi_err)
      return respond(res, http_server_error, 'Failed to get scribbles');
    if (!pagi_data || pagi_data.length === 0)
      return respond(res, http_no_content, 'No scribbles found');

    const total = all_data.length;
    const scribbles = pagi_data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, { scribbles, total });
  }

};
