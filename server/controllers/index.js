const express = require('express');
const { check } = require('express-validator');
const { verifyToken } = require('../lib');

const router = express.Router();

//------------------------------------------------------------------------
// Authentication
const auth = require('./auth');

router.post('/login', [
  check('email').isEmail().withMessage('Your e-mail or password was incorrect'),
  check('password').not().isEmpty().withMessage('Your e-mail or password was incorrect'),
], auth.login);
router.post('/register', [
  check('email').isEmail().withMessage('Please make sure your e-mail is valid'),
  check('password').isLength({ min: 8 }).withMessage('Your password must be at least 8 characters'),
  check('password').custom((value, { req }) => value === req.body.confirm_password)
    .withMessage('Please make sure the passwords match'),
], auth.register);
router.get('/logout', verifyToken, auth.logout);

// //------------------------------------------------------------------------
// // Users
// const users = require('./users');
//
// router.get('/users', verifyToken, users.getAll);
// router.get('/users/me', verifyToken, users.getMe);
// router.get('/users/:id', verifyToken, users.getByID);
// router.post('/users/send_recovery_email', users.sendRecoveryEmail);
// router.patch('/users', verifyToken, users.update);
// router.patch('/users/update_password', verifyToken, users.updatePassword);
// router.patch('/users/reset_password', users.resetPassword);

//------------------------------------------------------------------------
// Scribbles
const scribbles = require('./scribbles');

router.delete('/scribbles/:id', [
  check('id').not().isEmpty().withMessage('Please provide an ID'),
], verifyToken, scribbles.delete);
router.get('/scribbles', verifyToken, scribbles.getAll);
router.get('/scribbles/id/:id', [
  check('id').not().isEmpty().withMessage('Please provide an ID'),
], verifyToken, scribbles.getID);
router.get('/scribbles/owner/:owner_id', [
  check('owner_id').not().isEmpty().withMessage('Please provide an owner ID'),
], verifyToken, scribbles.getOwnerID);
router.get('/scribbles/tags/:owner_id', [
  check('owner_id').not().isEmpty().withMessage('Please provide an owner ID'),
], verifyToken, scribbles.getOwnerTags);
router.patch('/scribbles', [
  check('id').not().isEmpty().withMessage('Please provide an ID'),
  check('content').not().isEmpty().withMessage('Your scribble cannot be empty'),
], verifyToken, scribbles.update);
router.post('/scribbles', [
  check('content').not().isEmpty().withMessage('Your scribble cannot be empty'),
], verifyToken, scribbles.add);
router.post('/scribbles/filter', verifyToken, scribbles.filter);

module.exports = router;
