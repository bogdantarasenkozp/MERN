require('dotenv').config();
let { db } = require('../config')();

Object.assign(db, {
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data'
});

module.exports = {
  production: db,
  development: db,
  test: db
};
