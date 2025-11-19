const Joi = require("joi");

const cancelOrder = Joi.object({
  
  cancelReason: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.base": "Cancel Reason must be a string",
      "string.empty": "Cancel Reason is required",
      "string.min": "Cancel Reason must be at least 2 characters long",
      "any.required": "Cancel Reason is required",
    }),

 
});
const changeOrderStatus = Joi.object({
  status: Joi.string()
    .valid("processing", "shipped", "delivered", "cancelled")
    .required()
    .messages({
      "any.only": "Status must be one of processing, shipped, delivered, or cancelled",
      "any.required": "Status is required",
    }),

  reason: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .allow('')
    .messages({
      "string.base": "Reason must be a string",

      "string.min": "Reason must be at least 2 characters long",

    }),
    
});
module.exports = {cancelOrder, changeOrderStatus};
