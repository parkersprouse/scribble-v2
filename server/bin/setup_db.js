const User = require('../models/user');

(async function setup() {
  // Drop all tables
  await User.drop();

  // Create all tables
  await User.sync();

  // Clean up after syncing
  process.exit();
})();
