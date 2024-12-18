'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class properties extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  properties.init({
    property_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    property_name: DataTypes.STRING,
    street: DataTypes.STRING,
    zip: DataTypes.STRING,
    city: DataTypes.STRING,
    ward: DataTypes.STRING,
    location: DataTypes.STRING,
    detail: DataTypes.JSONB,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'properties',
  });
  return properties;
};