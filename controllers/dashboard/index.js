const router = require("express").Router();
const DashboardService = require("../../services/dashboard");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");
const { upload } = require("../../utils/multer");


router.get(
  "/dashboard",
  DashboardService.get
);


module.exports = router;
