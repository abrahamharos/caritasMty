const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      modelName: 'User',
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Ticket, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'user-tickets',
    });
  };

  return User;
};

module.exports = UserModel;

