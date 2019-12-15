const { validationResult } = require('express-validator');
const { DateTime } = require('luxon');
const { Sequelize } = require('../config/db');
const {
  http_ok,
  http_no_content,
  http_bad_request,
  http_server_error,
} = require('../config/constants');
const { call, respond } = require('../lib');
const Scribble = require('../models/scribble');

const { Op } = Sequelize;

module.exports = {

  async getAll(req, res) {
    const [err, data] = await call(Scribble.findAll());
    if (err) return respond(res, http_server_error, 'Failed to get all scribbles', err.message);
    if (!data || data.length === 0) return respond(res, http_bad_request, 'No scribbles found');

    const scribbles = data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, scribbles);
  },

  async getID(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const [err, data] = await call(Scribble.findOne(
      { where: { id: req.params.id } },
    ));
    if (err) return respond(res, http_server_error, 'Failed to get scribbles');
    if (!data) return respond(res, http_no_content, 'No scribble found');

    respond(res, http_ok, null, data);
  },

  async getOwnerID(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const [err, data] = await call(Scribble.findAll(
      { where: { owner_id: req.params.owner_id } },
    ));
    if (err) {
      return respond(res, http_server_error, 'Failed to get scribbles');
    }
    if (!data || data.length === 0) {
      return respond(res, http_no_content, 'No scribbles found');
    }

    const scribbles = data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, scribbles);
  },

  async getOwnerTags(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const [err, data] = await call(Scribble.findAll({
      where: { owner_id: req.params.owner_id },
      attributes: ['tags'],
    }));
    if (err) return respond(res, http_server_error, 'Failed to get tags');

    let all_tags = [];
    data.forEach(({ tags }) => {
      if (tags) all_tags = all_tags.concat(tags);
    });

    const uniq_tags = [];
    all_tags.forEach((tag) => {
      if (!uniq_tags.includes(tag)) uniq_tags.push(tag);
    });

    uniq_tags.sort();
    respond(res, http_ok, null, uniq_tags);
  },

  async add(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    if (!req.body.title) {
      req.body.title = DateTime.local().toFormat('MM/DD/YYYY h:mma');
    }

    const [err, data] = await call(Scribble.create(req.body));
    if (err) {
      return respond(res, http_server_error, 'Failed to create scribble');
    }

    respond(res, http_ok, null, data);
  },

  async update(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const [err, data] = await call(Scribble.update(
      req.body, { where: { id: req.body.id }, returning: true },
    ));
    if (err) {
      return respond(res, http_server_error, 'Failed to update scribble');
    }
    if (!data[0]) {
      return respond(res, http_bad_request,
        'No scribble updated, check provided ID');
    }

    // data[0] is the number of rows affected
    // data[1] is the array containing the returned rows
    // data[1][0] is the first game that was returned
    // data[1][0].dataValues is the object containing the values of the returned row
    respond(res, http_ok, null, data[1][0].dataValues);
  },

  async delete(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const [err, data] = await call(Scribble.destroy(
      { where: { id: req.params.id } },
    ));
    if (err) {
      return respond(res, http_server_error, 'Failed to delete scribble');
    }
    if (data < 1) {
      return respond(res, http_bad_request,
        'No scribble deleted, check provided ID');
    }

    respond(res, http_ok);
  },

  async filter(req, res) {
    const validation_errs = validationResult(req);
    if (!validation_errs.isEmpty()) {
      return respond(res, http_bad_request, validation_errs.array()[0].msg);
    }

    const { term, tag, owner_id } = req.query;
    let { page, per } = req.query;
    if (!page) page = 1;
    if (!per) per = 10;

    const body_search = { body: { [Op.iLike]: `%${term}%` } };
    const title_search = { title: { [Op.iLike]: `%${term}%` } };
    const search = { [Op.or]: [body_search, title_search] };

    const tag_filter = { tags: { $contains: [tag] } };

    let query = { owner_id };
    if (term) query = { ...query, ...search };
    if (tag) query = { ...query, ...tag_filter };

    const [all_err, all_data] = await call(Scribble.findAll({ where: query }));
    const [pagi_err, pagi_data] = await call(Scribble.findAll({
      where: query, limit: per, offset: (page - 1) * per, order: ['created_at'],
    }));
    if (all_err || pagi_err) {
      return respond(res, http_server_error, 'Failed to get scribbles');
    }
    if (!pagi_data || pagi_data.length === 0) {
      return respond(res, http_no_content, 'No scribbles found');
    }

    const total = all_data.length;
    const scribbles = pagi_data.map((scribble) => scribble.get({ plain: true }));
    respond(res, http_ok, null, { scribbles, total });
  },

};
