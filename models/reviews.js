"use strict";
const BaseModel = require("./baseModel");
const { DataTypes } = require("sequelize");

class Reviews extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }, 
        review: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        imagesUrl: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        }
      },
      {
        modelName: "Reviews",
        tableName: "reviews",
      }
    );
  }

  static associate(models) {
    Reviews.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}

module.exports = Reviews;
