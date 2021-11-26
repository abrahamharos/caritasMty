const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const db = require('../config');

const basename = path.basename(module.filename);
const modelsFolder = path.join(__dirname, '/models');
const models = {};

const sequelize = new Sequelize(
  `mssql://${db.dbUser}:${db.dbPassword}@${db.dbHost}:${db.dbPort}/${db.dbName}`,
  {
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
  }
);

const connectToDb = async () =>
  sequelize
    .authenticate()
    .then(() => {
      fs.readdirSync(modelsFolder)
        .filter(
          (file) =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        )
        .forEach((file) => {
          
          const model = require(path.join(modelsFolder, file)).default(
            sequelize,
            DataTypes
          );
          models[model.name] = model;
        });

      Object.keys(models).forEach((modelName) => {
        if (models[modelName].associate) {
          models[modelName].associate(models);
        }
      });
    })
    .then(async () => sequelize.sync({ force: false }));

module.exports = { connectToDb, sequelize, models };
