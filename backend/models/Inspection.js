const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inspection = sequelize.define('Inspection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  spbNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vessel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  agent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  inspectionTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Disetujui', 'Dalam Inspeksi', 'Pending Audit', 'Ditolak / Hold'),
    defaultValue: 'Pending Audit',
  },
  statusType: {
    type: DataTypes.ENUM('success', 'process', 'warning', 'danger'),
    defaultValue: 'warning',
  },
  officerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ocrNik: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ocrName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ktpPhotoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  matchStatus: {
    type: DataTypes.ENUM('Match', 'Mismatch', 'Unverified'),
    defaultValue: 'Unverified',
  },
}, {
  tableName: 'inspections',
  timestamps: true,
});

module.exports = Inspection;
