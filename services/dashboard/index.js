const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Product, Reviews, Category, Brands, Cart, Checkout, Checkout_Item } = require("../../models");
const { Op } = require("sequelize");
const { handleFileUpload } = require("../../utils/fileUpload");

const get = asyncErrorHandler(async (req, res) => {
  try {

    const products = await Product.count();
    const categories = await Category.count();
    const brands = await Brands.count();
    const pendingOrders = await Cart.count({}); 
    const processingOrders = await Checkout.count({ where: { status: "processing" } });
    const shippedOrders = await Checkout.count({ where: { status: "shipped" } });
    const deliveredOrders = await Checkout.count({ where: { status: "delivered" } });
    const cancelledOrders = await Checkout.count({ where: { status: "cancelled" } });
    const totalRevenue = await Checkout_Item.sum("price", );

    const data = {
      products,
      categories,
      brands,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    };

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.FOUND,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = {
  get,
};
