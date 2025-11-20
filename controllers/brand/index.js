const router = require("express").Router();
const BrandService = require("../../services/brand");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");
const { upload } = require("../../utils/multer");

router.post(
  "/add", 
   upload.single("image"),
  validate(validationSchemas.brand),
  BrandService.create
);

router.get("/get", BrandService.get);
router.get("/get/:id",  validateParams(validationSchemas.paramsIdValidation), BrandService.getOne);

router.post(
  "/update/:id",
  validateParams(validationSchemas.paramsIdValidation),
  validate(validationSchemas.brand),
  BrandService.update
);

router.delete("/delete/:id", BrandService.del);

module.exports = router;
