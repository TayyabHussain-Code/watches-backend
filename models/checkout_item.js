'use strict';
const BaseModel = require('./baseModel');
const { DataTypes } = require('sequelize');

class Checkout_Item extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
        checkoutId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        cartId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
        price: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
      },
      {
        modelName: 'Checkout_Item',
        tableName: 'checkout_item',
      }
    );
  }

  static associate(models) {
    Checkout_Item.belongsTo(models.Checkout, {
      foreignKey: 'checkoutId',
      as: 'checkout',
    });
    Checkout_Item.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
    
  }
}

module.exports = Checkout_Item;
