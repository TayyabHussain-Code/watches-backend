'use strict';
const BaseModel = require('./baseModel');
const { DataTypes } = require("sequelize");

  class Category extends BaseModel { 
     static initModel(sequelize){
      return super.initBase(
        sequelize, 
        {
           name: DataTypes.STRING,
           deleted: DataTypes.DATE,
        }, 
        {
          modelName: 'Category',
          tableName: 'categories',

          
        }
      )
     }
   
    static associate(models) {
      // define association here
    }
  }
 


module.exports = Category