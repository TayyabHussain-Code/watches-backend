const router = require("express").Router();
const BrandService = require("../../services/brand");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");

router.post(
  "/add",
//   validate(validationSchemas.productCategory),
  BrandService.create
);

router.get("/get", BrandService.get);
router.get("/get/:id", BrandService.get);

router.patch(
  "/update/:id",
  validateParams(validationSchemas.paramsIdValidation),
  validate(validationSchemas.user),
  BrandService.update
);

router.delete("/delete/:id", BrandService.del);

module.exports = router;
