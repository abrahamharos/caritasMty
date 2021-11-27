const DepartmentModel = (sequelize, DataTypes) => {
    const Department = sequelize.define(
      'Department',
      {
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        }
      },
      {
        modelName: 'Department',
      }
    );

    Department.associate = models => {
        Department.hasMany(models.Ticket, {
            foreignKey: {
                name: 'departmentId',
                allowNull: false,
              },
          as: 'department-tickets',
        });
      }

      Department.associate = models => {
        Department.hasMany(models.User, {
            foreignKey: {
                name: 'departmentId',
                allowNull: false,
              },
          as: 'department-users',
        });
      }

      return Department;
    };

module.exports = DepartmentModel;