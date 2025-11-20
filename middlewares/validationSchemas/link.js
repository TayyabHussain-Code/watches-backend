const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
  url: Joi.string()
    .required()
    .messages({
      "string.empty": "URL is required",
      "any.required": "URL is required",
    }),
});

module.exports = schema;