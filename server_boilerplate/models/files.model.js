module.exports = (args) => {
  const { sequelize, DataTypes } = args;

  let Files = sequelize.define('files', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    path: {
      type: DataTypes.STRING(500),
      unique: true
    },
    info: {
      type: DataTypes.JSONB
    },
    created: {
      type: DataTypes.DATE
    },
    updated: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    deletedAt: false
  });

  return Files;
};
