const Scribble = require('../models/scribble');
const User = require('../models/user');

(async function setup() {
  // Drop all tables
  await Scribble.drop();
  await User.drop();

  // Create all tables
  await User.sync();
  await Scribble.sync();

  // Clean up after syncing
  process.exit();
}());
