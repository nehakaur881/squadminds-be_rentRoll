'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      resettoken: {
        type: Sequelize.STRING
      },
      resettoken_expiry: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE
      },
      logintoken: {
        type: Sequelize.STRING
      },
      images: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      property_name: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      ward: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.JSONB
      },
      created_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('room', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      property_name: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      ward: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.JSONB
      },
      created_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('reservationroom', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      arrived_date: {
        type: Sequelize.DATE
      },
      departure_date: {
        type: Sequelize.DATE
      },
      check_in_times: {
        type: Sequelize.DATE
      },
      check_out_times: {
        type: Sequelize.DATE
      },
      guest: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      event_id: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      booking_source: {
        type: Sequelize.STRING
      },
      cleaning_id: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      montly: {
        type: Sequelize.BOOLEAN
      },
      cleaner: {
        type: Sequelize.STRING
      },
      additional_cost: {
        type: Sequelize.STRING
      },
      to_do: {
        type: Sequelize.STRING
      },
      changed: {
        type: Sequelize.STRING
      },
      reservation_id: {
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER
      },
      room_id: {
        type: Sequelize.INTEGER
      },
      rent_amount: {
        type: Sequelize.INTEGER
      },
      deposite_amount: {
        type: Sequelize.INTEGER
      },
      total_stay: {
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('expense', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expense_id: {
        type: Sequelize.INTEGER
      },
      reserveroom_id: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.JSON
      },
      date: {
        type: Sequelize.DATE
      },
      files: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.STRING
      },
      room_id: {
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      testing : {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
    await queryInterface.createTable('cleaning', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cleaning_date: {
        type: Sequelize.DATE
      },
      apartment: {
        type: Sequelize.STRING
      },
      cleaner: {
        type: Sequelize.STRING
      },
      additional_cost: {
        type: Sequelize.STRING
      },
      todo: {
        type: Sequelize.STRING
      },
      check_out_times: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      check_in_times: {
        type: Sequelize.DATE
      },
      move_out_dates: {
        type: Sequelize.DATE
      },
      guest: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      origin: {
        type: Sequelize.STRING
      },
      reserveroom_id: {
        type: Sequelize.INTEGER
      },
      cleaning_id: {
        type: Sequelize.INTEGER
      },
      room_id: {
        type: Sequelize.INTEGER
      },
      maintenance: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
  },
  async down(queryInterface, Sequelize) {
   
  }
};