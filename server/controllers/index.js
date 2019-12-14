const express = require('express');
const router = express.Router();

const { verifyToken } = require('./lib');

//------------------------------------------------------------------------
// Authentication
const auth = require('./auth');
router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/logout', verifyToken, auth.logout);

//------------------------------------------------------------------------
// Users
const users = require('./users');
router.get('/users', verifyToken, users.getAll);
router.get('/users/me', verifyToken, users.getMe);
router.get('/users/:id', verifyToken, users.getByID);
router.post('/users/send_recovery_email', users.sendRecoveryEmail);
router.patch('/users', verifyToken, users.update);
router.patch('/users/update_password', verifyToken, users.updatePassword);
router.patch('/users/reset_password', users.resetPassword);

//------------------------------------------------------------------------
// Scribbles
const scribbles = require('./scribbles');
router.delete('/scribbles/:id', verifyToken, scribbles.delete);
router.get('/scribbles', verifyToken, scribbles.getAll);
router.get('/scribbles/id/:id', verifyToken, scribbles.getID);
router.get('/scribbles/owner/:owner_id', verifyToken, scribbles.getOwnerID);
router.get('/scribbles/tags/:owner_id', verifyToken, scribbles.getOwnerTags);
router.patch('/scribbles', verifyToken, scribbles.update);
router.post('/scribbles', verifyToken, scribbles.add);
router.post('/scribbles/filter', verifyToken, scribbles.filter);

module.exports = router;
