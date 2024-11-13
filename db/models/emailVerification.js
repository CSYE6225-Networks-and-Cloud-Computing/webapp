// db/models/email.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const emailVerification = sequelize.define('emailVerification', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
  }, {
    timestamps: false, // Disable default timestamps
    freezeTableName: true,
    tableName: 'emailVerification'
  });

  return emailVerification;
};