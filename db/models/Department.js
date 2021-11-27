const Ticket = require('./Ticket');
const User = require('./User');

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

    return Department;
};
    
module.exports = DepartmentModel;