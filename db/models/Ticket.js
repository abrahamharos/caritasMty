const TicketModel = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      subject: {
        type: DataTypes.STRING(200),
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
      modelName: 'Ticket'
    }
  );

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'tickets-belongs-user',
    });
  };

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Deparment, {
      foreignKey: {
        name: 'departmentId',
        allowNull: false,
      },
      as: 'ticket-belongs-department',
    });
  };


  return Ticket;
};

export default TicketModel;
