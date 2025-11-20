const router = require("express").Router();
const SocialMediaService = require("../../services/media_link");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");
const { upload } = require("../../utils/multer");

router.post(
  "/add",
   upload.single("image"),
  validate(validationSchemas.Medialink),
  SocialMediaService.create
);

router.get("/get", SocialMediaService.get);
router.get("/get/:id",  validateParams(validationSchemas.paramsIdValidation), SocialMediaService.getOne);



router.delete("/delete/:id", SocialMediaService.del);

module.exports = router;
