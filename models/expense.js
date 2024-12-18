'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  expense.init({
    expense_id: DataTypes.INTEGER,
    reserveroom_id: DataTypes.INTEGER,
    title: DataTypes.JSON,
    date: DataTypes.DATE,
    files: DataTypes.STRING,
    created_at: DataTypes.STRING,
    room_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER,
    testing :DataTypes.text
  }, {
    sequelize,
    modelName: 'expense',
  });
  return expense;
};