const Joi = require("joi");

const reviewSchema = Joi.object({
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

  productId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid product ID format",
      "any.required": "Product ID is required",
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "Rating must be a number",
      "number.integer": "Rating must be an integer",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot be greater than 5",
      "any.required": "Rating is required",
    }),

  review: Joi.string()
    .trim()
    .allow(null, "")
    .max(1000)
    .messages({
      "string.base": "Review must be a string",
      "string.max": "Review cannot exceed 1000 characters",
    }),

 
});

module.exports = reviewSchema;
