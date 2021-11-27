const { Sequelize, DataTypes } = require('sequelize');
const { dbHost, dbPort, dbName, dbUser, dbPassword } = require('../config');
const TicketModel = require('./models/Ticket');
const UserModel = require('./models/User');
const DepartmentModel = require('./models/Department');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
});

const Ticket = TicketModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

Department.hasMany(Ticket, {
  foreignKey: {
    name: 'departmentId',
    allowNull: false,
  },
});

Ticket.belongsTo(Department, {
  foreignKey: {
    name: 'departmentId',
    allowNull: false,
  },
});

Department.hasMany(User, {
  foreignKey: {
    name: 'departmentId',
    allowNull: false,
  },
});

User.belongsTo(Department, {
  foreignKey: {
    name: 'departmentId',
    allowNull: false,
  },
});

User.hasMany(Ticket, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

Ticket.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

module.exports = { sequelize, Ticket, User, Department };
