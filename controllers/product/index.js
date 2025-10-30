const router = require("express").Router();
const ProductService = require("../../services/product");

const { validate } = require("../../middlewares/validator");
const validationSchemas = require("../../middlewares/validationSchemas");
const { validateParams } = require("../../middlewares/paramsValidate");
const { upload } = require("../../utils/multer");

router.post(
  "/add",
  upload.array("images", 5),
  validate(validationSchemas.product),
  ProductService.create
);

router.get("/get", ProductService.get);
router.get("/get/:id", validateParams(validationSchemas.paramsIdValidation), ProductService.getOne);

router.patch(
  "/update/:id",
  upload.array("images", 5),
  validateParams(validationSchemas.paramsIdValidation),
  validate(validationSchemas.productUpdate),
  ProductService.update
);

router.delete("/delete/:id", validateParams(validationSchemas.paramsIdValidation), ProductService.del);   

// add to cart  
router.post('/add-to-cart', validate(validationSchemas.cart), ProductService.addToCart)
router.get('/show-cart-item', ProductService.showCartItems)

module.exports = router;
