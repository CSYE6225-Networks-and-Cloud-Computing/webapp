'use strict';
const { Model,Sequelize, DataTypes } = require('sequelize');
const  bcrypt  = require('bcrypt');
const sequelize = require('../../config/database');

module.exports = sequelize.define('user', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // confirmPassword: {
  //   type: DataTypes.VIRTUAL,
  //   set(value){
  //     if(value === this.password){
  //       const hashPassword = bcrypt.hashSync(value,10);
  //       this.setDataValue('password', hashPassword);
  //     } else{
  //       throw new Error('password and confirm password must be same');

  //     }
  //   }
  // },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
}, {
    // paranoid: true,
    freezeTableName: true,
    modelName: 'user',
  
});
