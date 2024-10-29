// db/models/image.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    upload_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    timestamps: false, // Disable default timestamps
    freezeTableName: true,
    tableName: 'Image'
  });

  Image.associate = (models) => {
    Image.belongsTo(models.user, { foreignKey: 'user_id' });
  };

  return Image;
};