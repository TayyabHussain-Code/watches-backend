const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required().empty(''),
});

module.exports = schema;
