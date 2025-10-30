'use strict';
const BaseModel = require('./baseModel');
const { DataTypes } = require('sequelize'); 

class Cart extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
       
        productId: {
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
        }
      }, {
        modelName: 'Cart',
        tableName: 'cart',
      }
    ); 
  }

  static associate(models) {
    // define association here 
    Cart.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

module.exports = Cart;
