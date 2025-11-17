const router = require("express").Router();
const CategoryService = require("../../services/category");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");

router.post(
  "/add",
  validate(validationSchemas.category),
  CategoryService.create
);

router.get("/get", CategoryService.get);
router.get("/get/:id",  validateParams(validationSchemas.paramsIdValidation), CategoryService.getOne);

router.post(
  "/update/:id",
  validateParams(validationSchemas.paramsIdValidation),
  CategoryService.update
);

router.delete("/delete/:id", CategoryService.del);

module.exports = router;
