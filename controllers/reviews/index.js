const router = require("express").Router();
const ReviewService = require("../../services/reviews");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");
const { upload } = require("../../utils/multer");

router.post(
  "/add",
  upload.array("images", 2),
  validate(validationSchemas.review),
  ReviewService.create
);

router.get(
  "/get-by-product/:id",
  validateParams(validationSchemas.paramsIdValidation),
  ReviewService.get
);
router.get(
  "/get/:id",
  validateParams(validationSchemas.paramsIdValidation),
  ReviewService.getOne
);

// router.patch(
//   "/update/:id",
//   validateParams(validationSchemas.paramsIdValidation),
//   validate(validationSchemas.brand),
//   ReviewService.update
// );

router.delete("/delete/:id", ReviewService.del);

module.exports = router;
