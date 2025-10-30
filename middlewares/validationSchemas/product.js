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

    description: Joi.string()
      .trim()
      .max(5000)
      .allow('', null)
      .messages({
        'string.max': 'Description must not exceed 5000 characters'
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

    otherImages: Joi.array()
      .items(Joi.string().uri())
      .allow(null)
      .messages({
        'array.base': 'Other images must be an array',
        'string.uri': 'Each image must be a valid URL'
      })

});

const update = Joi.object({

    name: Joi.string()
      .trim()
      .min(3)
      .max(255)
      .messages({
        'string.empty': 'Product name cannot be empty',
        'string.min': 'Product name must be at least 3 characters long',
        'string.max': 'Product name must not exceed 255 characters'
      }),

    price: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be a positive number'
      }),

    description: Joi.string()
      .trim()
      .max(5000)
      .allow('', null)
      .messages({
        'string.max': 'Description must not exceed 5000 characters'
      }),

    categoryId: Joi.string()
      .uuid()
      .messages({
        'string.guid': 'Invalid category ID format'
      }),

    brandId: Joi.string()
      .uuid()
      .messages({
        'string.guid': 'Invalid brand ID format'
      }),

    stock: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'Stock must be a number',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative'
      }),

    stockStatus: Joi.string()
      .valid('in_stock', 'out_of_stock')
      .messages({
        'any.only': 'Stock status must be either in_stock or out_of_stock'
      }),

    coverImage: Joi.string()
      .uri()
      .allow('', null)
      .messages({
        'string.uri': 'Cover image must be a valid URL'
      }),

    otherImages: Joi.array()
      .items(Joi.string().uri())
      .allow(null)
      .messages({
        'array.base': 'Other images must be an array',
        'string.uri': 'Each image must be a valid URL'
      })

});

module.exports = {create, update};
