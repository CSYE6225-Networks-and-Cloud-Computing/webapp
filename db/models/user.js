// db/models/user.js
const { DataTypes } = require('sequelize');

// Export a function that takes sequelize as an argument
module.exports = (sequelize) => {
  const user = sequelize.define('user', {
    // const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_created: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    account_updated: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    
  }, {
    createdAt: 'account_created', // Custom createdAt field
    updatedAt: 'account_updated', // Custom updatedAt field
    freezeTableName: true,
    // modelName: 'user',
  });

  return user; // Return the model
  // return User;
};