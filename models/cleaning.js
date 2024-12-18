'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cleaning extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cleaning.init({
    cleaning_date: DataTypes.DATE,
    apartment: DataTypes.STRING,
    cleaner: DataTypes.STRING,
    additional_cost: DataTypes.STRING,
    todo: DataTypes.STRING,
    check_out_times: DataTypes.STRING,
    notes: DataTypes.STRING,
    check_in_times: DataTypes.DATE,
    move_out_dates: DataTypes.DATE,
    guest: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    origin: DataTypes.STRING,
    reserveroom_id: DataTypes.INTEGER,
    cleaning_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    maintenance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cleaning',
  });
  return cleaning;
};