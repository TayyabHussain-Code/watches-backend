const router = require("express").Router();
const AuthService = require("../../services/auth");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");

router.post(
  "/login",
  validate(validationSchemas.login),
  AuthService.login
);



module.exports = router;
