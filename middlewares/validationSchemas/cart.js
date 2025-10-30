const Joi = require("joi");

const schema = Joi.object({
  productId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid product ID format',
      'any.required': 'Product ID is required'
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity cannot be less than 1',
      'number.max': 'Quantity cannot be more than 3',
      'any.required': 'Quantity is required'
    }),


});

module.exports =schema;
