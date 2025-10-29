"use strict";
const { DataTypes } = require("sequelize");
const BaseModel = require("./baseModel");

class User extends BaseModel {
  static initModel(sequelize) {
    return super.initBase(
      sequelize,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM("admin", "user", "guest"),
          allowNull: false,
          defaultValue: "admin",
        },
      },
      {
        modelName: "User",
        tableName: "users",
      }
    );
  }
  static associate(models) {
    // define association here
  }
}
module.exports = User;
