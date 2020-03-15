const { db, Sequelize } = require('../config/db');
const User = require('./user');

const attributes = {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, unique: true, primaryKey: true,
  },
  content: { type: Sequelize.TEXT, allowNull: false },
  title: { type: Sequelize.TEXT },
  tags: { type: Sequelize.ARRAY(Sequelize.TEXT) },
  public: { type: Sequelize.BOOLEAN },
  rich_editor: { type: Sequelize.BOOLEAN },
  owner_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
    },
  },
};

const table_config = {
  timestamps: true,
  freezeTableName: true,
  underscored: true,
};

const Scribbles = db.define('scribbles', attributes, table_config);

module.exports = Scribbles;
