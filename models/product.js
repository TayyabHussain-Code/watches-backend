'use strict';
const BaseModel = require('./baseModel');
const { DataTypes } = require('sequelize'); 

class Product extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        price: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        description: DataTypes.TEXT,
        categoryId: {
          type: DataTypes.UUID,
          allowNull: false,
        }, 
        brandId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        stockStatus: {
          type: DataTypes.ENUM('in_stock', 'out_of_stock'),
          defaultValue: 'in_stock',
        },
        coverImage: {
          type: DataTypes.STRING,
        }, 
        otherImages: {
          type: DataTypes.ARRAY(DataTypes.STRING),
        }
      }, {
        modelName: 'Product',
        tableName: 'products',
      }
    ); 
  }

  static associate(models) {
    // define association here
  }
}

module.exports = Product;
