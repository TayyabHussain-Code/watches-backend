"use strict";
const BaseModel = require("./baseModel");
const { DataTypes } = require("sequelize");

class Product extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        discount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        totalprice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
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
          type: DataTypes.ENUM("in_stock", "out_of_stock"),
          defaultValue: "in_stock",
        },
        coverImage: {
          type: DataTypes.STRING,
        },
        otherImages: {
          type: DataTypes.ARRAY(DataTypes.STRING),
        },
      },
      {
        modelName: "Product",
        tableName: "products",
      }
    );
  }

  static associate(models) {
    // define association here
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
    Product.belongsTo(models.Brands, { foreignKey: "brandId", as: "brand" });
    Product.hasMany(models.Cart, { foreignKey: "productId", as: "carts" });
  }
}

module.exports = Product;
