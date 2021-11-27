const { Sequelize, DataTypes } = require('sequelize');
const { dbHost, dbPort, dbName, dbUser, dbPassword } = require('../config');
const TicketModel = require('./models/Ticket');
const DepartmentModel = require('./models/Department');
const UserModel = require('./models/User');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
});

const Ticket = TicketModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

module.exports = { sequelize, Ticket, Department, User };
