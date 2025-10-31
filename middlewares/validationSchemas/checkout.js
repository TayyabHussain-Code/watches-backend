const Joi = require("joi");

const productSchema = Joi.object({
  productId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid product ID format",
      "any.required": "Product ID is required",
    }),

  cartId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid cart ID format",
      "any.required": "Cart ID is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity cannot be less than 1",
      "number.max": "Quantity cannot be more than 10",
      "any.required": "Quantity is required",
    }),
});

const checkoutSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid phone number format",
      "any.required": "Phone number is required",
    }),

  address: Joi.string()
    .trim()
    .min(5)
    .max(255)
    .required()
    .messages({
      "string.base": "Address must be a string",
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters long",
      "any.required": "Address is required",
    }),

  products: Joi.array()
    .items(productSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Products must be an array",
      "array.min": "At least one product is required",
      "any.required": "Products are required",
    }),
});

module.exports = checkoutSchema;
