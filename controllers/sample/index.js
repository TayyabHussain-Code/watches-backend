const router = require("express").Router();
const sampleService = require("../../services/user");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");

router.post(
  "/add",
  validate(validationSchemas.productCategory),
  sampleService.create
);

router.get("/get", sampleService.get);
router.get("/get/:id", sampleService.get);

router.patch(
  "/update/:id",
  validateParams(validationSchemas.paramsIdValidation),
  validate(validationSchemas.user),
  sampleService.update
);

router.delete("/delete/:id", sampleService.del);

module.exports = router;
