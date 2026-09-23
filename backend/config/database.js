const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'db_calokapal_ksop';

// Function to ensure database exists in MySQL
async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
  } catch (error) {
    console.error('Failed to create database automatically:', error.message);
  }
}

const sequelize = new Sequelize(dbName, user, password, {
  host: host,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize, ensureDatabaseExists };
