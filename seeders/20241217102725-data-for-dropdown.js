'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('dropdown', [
      { 
          booking_source: ['Direct' , 'CIE website' , 'Returning Guest', 'Facebook' , 'Craigslist' , 'Paul'],
          payment_method: ['wise' , 'Revolut' , 'int bank transfer' , 'local bank transfer' ,'credit card'], 
          created_at: new Date(),
          
      },
      
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
