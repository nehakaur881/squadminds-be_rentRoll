'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reservationroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reservationroom.init({
    name: DataTypes.STRING,
    arrived_date: DataTypes.DATE,
    departure_date: DataTypes.DATE,
    check_in_times: DataTypes.DATE,
    check_out_times: DataTypes.DATE,
    guest: DataTypes.STRING,
    notes: DataTypes.STRING,
    event_id: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    booking_source: DataTypes.STRING,
    cleaning_id: DataTypes.STRING,
    currency: DataTypes.STRING,
    amount: DataTypes.STRING,
    montly: DataTypes.BOOLEAN,
    cleaner: DataTypes.STRING,
    additional_cost: DataTypes.STRING,
    to_do: DataTypes.STRING,
    changed: DataTypes.STRING,
    reservation_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    rent_amount: DataTypes.INTEGER,
    deposite_amount: DataTypes.INTEGER,
    total_stay: DataTypes.INTEGER,
    payment_method: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reservationroom',
  });
  return reservationroom;
};



