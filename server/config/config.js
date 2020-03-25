require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    url: process.env.DATABASE_URL,
  },
  production: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    url: process.env.DATABASE_URL,
  },
};
