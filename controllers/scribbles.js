const { Sequelize } = require('../config/db');
const {
  http_ok,
  http_bad_request,
  http_not_found,
  http_server_error,
} = require('../config/constants');
const { call, respond } = require('../lib');
const Scribble = require('../models/scribble');
const User = require('../models/user');

const { Op } = Sequelize;

module.exports = {

  async getAll(req, res) {
    const [err, data] = await call(Scribble.findAll());
    if (err || !data) {
      return respond(res, http_server_error, 'Failed to get all scribbles', err.message || err);
    }

    const scribbles = data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, scribbles);
  },

  async getID(req, res) {
    const [err, data] = await call(Scribble.findOne({
      where: { id: req.params.id },
      include: [{ model: User, required: true, attributes: ['id', 'email', 'name'] }],
    }));
    if (err) return respond(res, http_server_error, 'Failed to get scribble');
    if (!data || (data.owner_id !== req.current_user.id && !data.public)) {
      return respond(res, http_not_found, 'Scribble not found');
    }

    respond(res, http_ok, null, data);
  },

  async getOwnerID(req, res) {
    const owner_id = req.params.owner_id || req.current_user.id;
    const [err, data] = await call(Scribble.findAll({
      where: { owner_id },
      include: [{ model: User, required: true, attributes: ['id', 'email', 'name'] }],
    }));
    if (err || !data) {
      return respond(res, http_server_error, 'Failed to get scribbles', err.message || err);
    }

    const scribbles = data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, scribbles);
  },

  async getOwnerTags(req, res) {
    const owner_id = req.params.owner_id || req.current_user.id;
    const [err, data] = await call(Scribble.findAll({
      where: { owner_id },
      attributes: ['tags'],
    }));
    if (err || !data) {
      return respond(res, http_server_error, 'Failed to get tags', err.message || err);
    }

    let all_tags = [];
    data.forEach(({ tags }) => {
      if (tags) all_tags = all_tags.concat(tags);
    });

    respond(res, http_ok, null, [...new Set(all_tags)].sort());
  },

  async add(req, res) {
    const [err, data] = await call(Scribble.create({ ...req.body, owner_id: req.current_user.id }));
    if (err || !data) {
      return respond(res, http_server_error, 'Failed to create scribble', err.message || err);
    }

    respond(res, http_ok, null, data);
  },

  async update(req, res) {
    const [err, data] = await call(Scribble.update(
      req.body, { where: { id: req.params.id, owner_id: req.current_user.id }, returning: true },
    ));
    if (err) {
      return respond(res, http_server_error, 'Failed to update scribble', err.message || err);
    }
    if (!data[0]) return respond(res, http_bad_request, 'No scribble updated, check provided ID');

    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    respond(res, http_ok, null, data[1][0].dataValues);
  },

  async delete(req, res) {
    const [err, data] = await call(Scribble.destroy({
      where: { id: req.params.id, owner_id: req.current_user.id },
    }));
    if (err) {
      return respond(res, http_server_error, 'Failed to delete scribble', err.message || err);
    }
    if (data < 1) return respond(res, http_bad_request, 'No scribble deleted, check provided ID');

    respond(res, http_ok);
  },

  async filter(req, res) {
    const { search, tag } = req.query;
    let { page, per } = req.query;
    if (!page) page = 1;
    if (!per) per = 10;

    const body_search = { content: { [Op.iLike]: `%${search}%` } };
    const title_search = { title: { [Op.iLike]: `%${search}%` } };
    const merged_search = { [Op.or]: [body_search, title_search] };

    const tag_filter = { tags: { [Op.contains]: [tag] } };

    let query = { owner_id: req.current_user.id };
    if (search) query = { ...query, ...merged_search };
    if (tag) query = { ...query, ...tag_filter };

    const [all_err, all_data] = await call(Scribble.findAll({ where: query }));
    const [pagi_err, pagi_data] = await call(Scribble.findAll({
      where: query,
      limit: per,
      offset: (page - 1) * per,
      order: ['created_at'],
      include: [{ model: User, required: true, attributes: ['id', 'email', 'name'] }],
    }));
    if (all_err || pagi_err || !pagi_data) {
      return respond(res, http_server_error, 'Failed to get scribbles');
    }

    const total = all_data.length;
    const pages = Math.ceil(total / per);
    const scribbles = pagi_data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, { scribbles, meta: { pages, total } });
  },

};
