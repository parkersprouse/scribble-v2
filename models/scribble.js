const { db, Sequelize } = require('../config/db');
const User = require('./user');

const attributes = {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, unique: true, primaryKey: true,
  },
  content: { type: Sequelize.TEXT, allowNull: false },
  public: { type: Sequelize.BOOLEAN },
  rich_editor: { type: Sequelize.BOOLEAN },
  tags: { type: Sequelize.ARRAY(Sequelize.TEXT) },
  title: { type: Sequelize.TEXT },
};

const table_config = {
  timestamps: true,
  freezeTableName: true,
  underscored: true,
};

const Scribble = db.define('scribbles', attributes, table_config);
Scribble.belongsTo(User, {
  foreignKey: { allowNull: false, name: 'owner_id' }, // the user who created the scribble
  hooks: true,
  onDelete: 'cascade',
});

module.exports = Scribble;
