const Department = require('./Department');
const User = require('./User');

const TicketModel = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'ticket',
    {
      subject: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      evidence: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      priority: {
        type: DataTypes.INTEGER,
      },
      extras: {
        type: DataTypes.JSON,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      modelName: 'Ticket',
    }
  );

  return Ticket;
};

module.exports = TicketModel;
