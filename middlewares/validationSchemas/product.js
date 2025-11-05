const Joi = require("joi");

const create = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name must not exceed 255 characters',
      'any.required': 'Product name is required'
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),

  discount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'discount must be a number',
      'number.positive': 'discount must be a positive number',
      'any.required': 'discount is required'
    }),

  // 👇 THIS is the fixed version
  description: Joi.alternatives().try(
    Joi.array().items(
      Joi.string()
        .trim()
        .max(1000)
        .messages({
          'string.max': 'Each description point must not exceed 1000 characters'
        })
    ),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error();
        return parsed;
      } catch {
        return helpers.error('array.base');
      }
    })
  ).allow(null).messages({
    'array.base': 'Description must be an array of strings'
  }),

  categoryId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid category ID format',
      'any.required': 'Category ID is required'
    }),

  brandId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid brand ID format',
      'any.required': 'Brand ID is required'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),

  stockStatus: Joi.string()
    .valid('in_stock', 'out_of_stock')
    .default('in_stock')
    .messages({
      'any.only': 'Stock status must be either in_stock or out_of_stock'
    }),

  coverImage: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'Cover image must be a valid URL'
    }),

  otherImages: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error();
        return parsed;
      } catch {
        return helpers.error('array.base');
      }
    })
  ).allow(null).messages({
    'array.base': 'Other images must be an array',
    'string.uri': 'Each image must be a valid URL'
  })
});

module.exports = { create };
