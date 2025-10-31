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

  reason: Joi.when("status", {
    is: "cancelled",
    then: Joi.string()
      .trim()
      .allow('')
      .min(2)
      .max(255)
      .required()
      .messages({
        "string.base": "Cancel reason must be a string",
        "string.empty": "Cancel reason is required",
        "string.min": "Cancel reason must be at least 2 characters long",
        "any.required": "Cancel reason is required when status is cancelled",
      }),
    otherwise: Joi.string().allow("").optional(),
  }),
});
module.exports = {cancelOrder, changeOrderStatus};
