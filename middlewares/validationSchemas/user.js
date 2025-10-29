const Joi = require("joi");

const login = Joi.object({
  email: Joi.string().email().required().empty(''),
  password: Joi.string().required().empty(''),
});

module.exports = login;
