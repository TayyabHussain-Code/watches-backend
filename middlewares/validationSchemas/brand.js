const Joi = require("joi");

const brand = Joi.object({
  name: Joi.string().required().empty(''),
});

module.exports = brand;
