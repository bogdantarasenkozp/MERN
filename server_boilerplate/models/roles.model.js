module.exports = (args) => {
  const { sequelize, DataTypes } = args;

  let Roles = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255)
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Roles;
};
