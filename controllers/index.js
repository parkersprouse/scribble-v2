/* eslint max-len: 0 */

const express = require('express');
const { check } = require('express-validator');
const { validateParams, verifyToken } = require('../lib');

const router = express.Router();

//------------------------------------------------------------------------
// Authentication
const auth = require('./auth');

router.post('/login', [
  check('email').isEmail().withMessage('Your e-mail or password was incorrect'),
  check('password').not().isEmpty().withMessage('Your e-mail or password was incorrect'),
], validateParams, auth.login);

router.post('/register', [
  check('email').isEmail().withMessage('Please make sure your e-mail is valid'),
  check('password').isLength({ min: 8 }).withMessage('Your password must be at least 8 characters'),
  check('password').custom((value, { req }) => value === req.body.confirm_password).withMessage('Please make sure the passwords match'),
], validateParams, auth.register);

router.get('/logout', verifyToken, auth.logout);

//------------------------------------------------------------------------
// Users
const users = require('./users');

router.delete('/users/:id', verifyToken, users.delete);

router.get('/users', verifyToken, users.getAll);

router.get('/users/me', verifyToken, users.getMe);

router.get('/users/:id', verifyToken, users.getID);

router.patch('/users', [
  check('password_current').not().isEmpty().withMessage('Please provide your current password'),
  check('email').isEmail().withMessage('Please make sure your e-mail is valid'),
], verifyToken, validateParams, users.update);

router.patch('/users/password', [
  check('password_current').not().isEmpty().withMessage('Please provide your current password'),
  check('password_new').isLength({ min: 8 }).withMessage('Your password must be at least 8 characters'),
  check('password_new').custom((value, { req }) => value === req.body.password_new_confirm).withMessage('Please make sure the passwords match'),
], verifyToken, validateParams, users.updatePassword);

//------------------------------------------------------------------------
// Scribbles
const scribbles = require('./scribbles');

router.delete('/scribbles/:id', verifyToken, scribbles.delete);

router.get('/scribbles', verifyToken, scribbles.getAll);

router.get('/scribbles/filter', verifyToken, scribbles.filter);

router.get('/scribbles/id/:id', verifyToken, scribbles.getID);

router.get('/scribbles/owner/:owner_id', verifyToken, scribbles.getOwnerID);
router.get('/scribbles/owner', verifyToken, scribbles.getOwnerID);

router.get('/scribbles/tags/:owner_id', verifyToken, scribbles.getOwnerTags);
router.get('/scribbles/tags', verifyToken, scribbles.getOwnerTags);

router.patch('/scribbles', [
  check('id').not().isEmpty().withMessage('Please provide an ID'),
  check('content').not().isEmpty().withMessage('Your scribble cannot be empty'),
], verifyToken, validateParams, scribbles.update);

router.post('/scribbles', [
  check('content').not().isEmpty().withMessage('Your scribble cannot be empty'),
], verifyToken, validateParams, scribbles.add);

module.exports = router;
