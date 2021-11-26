const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
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

export default UserModel;
