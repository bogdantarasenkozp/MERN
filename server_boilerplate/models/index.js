module.exports = (args) => {
  const { config } = args;
  const { Sequelize } = args.package;

  const sequelize = new Sequelize(config.db.url, config.db);
  const params = { sequelize, DataTypes: Sequelize };

  // Models/tables
  let db = {
    Roles: require('./roles.model')(params),
    Users: require('./users.model')(params),
    Files: require('./files.model')(params)
  };

  // Relations
  db.Users.belongsTo(db.Roles);

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  db.sequelize.sync();

  return db;
};
