const { Sequelize, DataTypes } = require('sequelize');
const { dbHost, dbPort, dbName, dbUser, dbPassword } = require('../config');
const TicketModel = require('./models/Ticket');
const UserModel = require('./models/User');
const DepartmentModel = require('./models/Department');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
})


const Ticket = TicketModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Deparment = DepartmentModel(sequelize, DataTypes);
module.exports = { sequelize, Ticket, User, Deparment};
