const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocs = require('../swagger');

const options ={
  swaggerDefinition: swaggerDocs,
  apis: ["../swagger/*.js"],
};

module.exports.swaggerSpec = swaggerJsdoc(options);


