const { Sequelize, DataTypes } = require('sequelize');
const { dbHost, dbPort, dbName, dbUser, dbPassword } = require('../config');
const TicketModel = require('./models/Ticket');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
});

const Ticket = TicketModel(sequelize, DataTypes);

module.exports = { sequelize, Ticket };
