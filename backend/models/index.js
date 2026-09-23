const { sequelize, ensureDatabaseExists } = require('../config/database');
const User = require('./User');
const Manifest = require('./Manifest');
const Inspection = require('./Inspection');

module.exports = {
  sequelize,
  ensureDatabaseExists,
  User,
  Manifest,
  Inspection,
};
