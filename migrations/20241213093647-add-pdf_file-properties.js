"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("properties", "pdf_file", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.sequelize.query(` 
      SELECT setval(
        'reservationroom1_reservation_id_seq',
        (SELECT MAX(reservation_id) FROM reservationroom)
      );
    `);
    await queryInterface.changeColumn("expense", "title", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.createTable("dropdown", {
      dropdown_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      booking_source: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      payment_method: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addColumn("users", "contact", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("users", "images", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
