require('dotenv').config();

module.exports = {
  cookie_secret: process.env.COOKIE_SECRET,
  db: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  sentry_url: process.env.SENTRY_URL,
};
