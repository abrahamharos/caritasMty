const DepartmentModel = (sequelize, DataTypes) => {
    const Department = sequelize.define(
      'department',
      {
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        }
      },
      {
        timestamps: false,
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