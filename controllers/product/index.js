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
router.get("/get-by-category/:id", validateParams(validationSchemas.paramsIdValidation), ProductService.getByCategory);
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
router.patch('/update-cart-item/:id', validateParams(validationSchemas.paramsIdValidation),  ProductService.updateCart)
router.post('/show-cart-item', ProductService.showCartItems)  
router.delete('/remove-cart-item/:id', validateParams(validationSchemas.paramsIdValidation), ProductService.removeCartItem)

// checkout  
router.post('/checkout', 
  validate(validationSchemas.checkout),
   ProductService.checkout);   

// show checkout orders 
router.get('/show-checkout-orders', ProductService.showCheckoutOrders)  

// cancel order 
router.patch('/cancel-order/:id', 
  validateParams(validationSchemas.paramsIdValidation),
  validate(validationSchemas.cancelOrder),
   ProductService.cancelOrder);

// change order status
router.patch('/change-order-status/:id', 
  validateParams(validationSchemas.paramsIdValidation),
  validate(validationSchemas.changeOrderStatus),
   ProductService.changeOrderStatus);
module.exports = router;
