'use strict';
const BaseModel = require('./baseModel');
const { DataTypes } = require("sequelize"); 

  class Media_Link extends BaseModel { 
     static initModel(sequelize){
      return super.initBase(
        sequelize, 
        {
           name: {
            type: DataTypes.STRING,
            allowNull: false
           },
            url: DataTypes.STRING,
            icon: DataTypes.STRING, 
        
        }, 
        {
          modelName: 'Media_Link',
          tableName: 'media_link',

        }
      )
     }
   
    static associate(models) {
      // define association here
    }
  }
  

module.exports = Media_Link