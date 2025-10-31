"use strict";
const BaseModel = require("./baseModel");
const { DataTypes } = require("sequelize");

class Checkout extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        orderId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM(
            "processing",
            "shipped",
            "delivered",
            "cancelled"
          ),
          defaultValue: "processing",
          allowNull: false,
        },
        cancelReason: {
            type: DataTypes.STRING,
            allowNull: true,
          },
      },
      {
        modelName: "Checkout",
        tableName: "checkout",
      }
    );
  }

  static associate(models) {
    Checkout.hasMany(models.Checkout_Item, {
      foreignKey: "checkoutId",
      as: "items",
    });
  }
}

module.exports = Checkout;
