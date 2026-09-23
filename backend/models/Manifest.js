const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Manifest = sequelize.define('Manifest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  spbNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shipName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scheduleTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passengerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ticketNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('L', 'P'),
    defaultValue: 'L',
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Valid', 'Mismatch', 'Pending'),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'manifests',
  timestamps: true,
});

module.exports = Manifest;
