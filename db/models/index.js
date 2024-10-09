// db/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: console.log
});

const db = {};

// Dynamically import all models
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes); // Pass both sequelize and DataTypes
    console.log(`Loaded model: ${model.name}`); // Debugging statement
    db[model.name] = model; // Store the model in db object
  });

// Define associations if necessary
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// No need to sync database here since it's done in app.js
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
