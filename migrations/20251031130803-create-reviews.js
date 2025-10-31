'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      imagesUrl: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted: {
        allowNull: true,
        type: Sequelize.DATE,
      },  
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reviews');
  },
};
