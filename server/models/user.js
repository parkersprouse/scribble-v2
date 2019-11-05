const { db, Sequelize } = require('../config/db');

const attributes = {
  id:           { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, unique: true, primaryKey: true },
  email:        { type: Sequelize.TEXT, allowNull: false, unique: true },
  name:         { type: Sequelize.TEXT },
  pw_hash:      { type: Sequelize.TEXT, allowNull: false },
  pw_reset_key: { type: Sequelize.TEXT }
};

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration
const table_config = {
  timestamps:      true,
  freezeTableName: true,
  underscored:     true,
  indexes: [{
    name: 'users_lowercase_email',
    method: 'BTREE',
    unique: true,
    fields: [db.fn('LOWER', db.col('email'))]
  }]
};

const User = db.define('users', attributes, table_config);

module.exports = User;
