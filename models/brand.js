'use strict';
const BaseModel = require('./baseModel');
const { DataTypes } = require("sequelize"); 

  class Brands extends BaseModel { 
     static initModel(sequelize){
      return super.initBase(
        sequelize, 
        {
           name: {
            type: DataTypes.STRING,
            allowNull: false
           },
            icon: DataTypes.STRING, 
        
        }, 
        {
          modelName: 'Brands',
          tableName: 'brands',

        }
      )
     }
   
    static associate(models) {
      // define association here
    }
  }
  

module.exports = Brands