const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const {
  Category,
  Brands,
  Product,
  Cart,
  Checkout,
  Checkout_Item,
  Reviews,
} = require("../../models");
const { Op } = require("sequelize");
const { handleFileUpload } = require("../../utils/fileUpload");

const fs = require("fs").promises;

const create = asyncErrorHandler(async (req, res) => {
  const uploadedFilePaths = [];
  try {
    let coverImage = null;
    let otherImages = [];

    if (req.files && req.files.length > 0) {
      // First file as coverImage
      coverImage = `/images/${req.files[0].filename}`;
      uploadedFilePaths.push(req.files[0].path); //  PATH SAVE

      // Remaining files as otherImages
      for (let i = 1; i < req.files.length; i++) {
        otherImages.push(`/images/${req.files[i].filename}`);
        uploadedFilePaths.push(req.files[i].path); // PATH SAVE
      }
    }

    // handle discount in %
    if (req.body.discount && req.body.discount > 0) {
      req.body.totalprice = Math.round(
        parseFloat(req.body.price) * (1 - parseFloat(req.body.discount) / 100)
      );
    } else {
      req.body.totalprice = req.body.price;
    }

    if (req.body.description && typeof req.body.description === "string") {
      req.body.description = JSON.parse(req.body.description);
    }
    // Create product
    const data = await Product.create({
      ...req.body,
      coverImage,
      otherImages,
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: TEXTS.CREATED,
      data,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // file delete
    if (uploadedFilePaths.length > 0) {
      console.log("Rolling back uploaded files...");
      for (const filePath of uploadedFilePaths) {
        try {
          if (filePath && typeof filePath === "string") {
            await fs.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        } catch (deleteError) {
          console.error(`Failed to delete file ${filePath}:`, deleteError);
        }
      }
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

const update = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const currentRecord = await Product.findByPk(id);

  if (!currentRecord) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "No record found against the id for update.",
    });
  }

  let coverImage = currentRecord.coverImage;
  let otherImages = currentRecord.otherImages;

  const uploadedFilePaths = [];

  if (req.files && req.files.length > 0) {
    // Delete old files first
    const oldFiles = [];

    if (coverImage) oldFiles.push(`./public${coverImage}`);
    if (otherImages && Array.isArray(otherImages)) {
      otherImages.forEach((img) => oldFiles.push(`./public${img}`));
    }

    for (const path of oldFiles) {
      try {
        await fs.unlink(path);
        console.log(`Deleted old file: ${path}`);
      } catch (err) {
        console.error(`Failed to delete file ${path}:`, err);
      }
    }

    // Save new uploaded files
    coverImage = `/image/${req.files[0].filename}`;
    uploadedFilePaths.push(req.files[0].path);

    otherImages = [];
    for (let i = 1; i < req.files.length; i++) {
      otherImages.push(`/image/${req.files[i].filename}`);
      uploadedFilePaths.push(req.files[i].path);
    }
  }

  let priceToUse = req.body.price
    ? parseFloat(req.body.price)
    : parseFloat(currentRecord.price);
  let discountToUse = req.body.discount
    ? parseFloat(req.body.discount)
    : parseFloat(currentRecord.discount) || 0;

  if (discountToUse > 0) {
    req.body.totalprice = Math.round(priceToUse * (1 - discountToUse / 100));
  } else {
    req.body.totalprice = priceToUse;
  }

  const updateData = { ...req.body };
  // Update product
  const [status, updatedData] = await Product.update(
    { ...updateData, coverImage, otherImages },
    {
      where: { id },
      returning: true,
    }
  );

  if (!status) {
    // Rollback new uploaded files if update failed
    for (const filePath of uploadedFilePaths) {
      try {
        await fs.unlink(filePath);
        console.log(`Deleted uploaded file due to rollback: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err);
      }
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Update failed",
    });
  }

  return res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    message: "Record updated successfully",
    // data: updatedData[0], // Uncomment if you want to return updated product
  });
});

const get = asyncErrorHandler(async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      attributes: [
        "id",
        "name",
        "coverImage",
        "otherImages",
        "stock",
        "stockStatus",
        "price",
        "totalprice",
        "discount",
        "description",
      ],

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Brands,
          as: "brand",
          attributes: ["id", "name", "icon"],
        },
      ],

      where: filter,
      ...req.pagination,
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.FOUND,
      data: rows,
      total: count,
      limit: req.pagination.limit,
      pageCount: Math.ceil(count / req.pagination.limit),
      page: req.pagination.offset / req.pagination.limit + 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

const getByCategory = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { search, page, limit } = req.query;

    const pageNum = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 9;
    const offset = (pageNum - 1) * pageLimit;

    let filter = {};

    if (search) {
      filter.name = { [Op.iLike]: `%${search}%` };
    }

    if (!id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Please provide category id.",
      });
    }

    const isExistCategory = await Category.findByPk(id);

    if (!isExistCategory) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No category found against the id.",
      });
    }

    filter.categoryId = id;

    const { count, rows } = await Product.findAndCountAll({
      attributes: [
        "id",
        "name",
        "coverImage",
        "otherImages",
        "stock",
        "stockStatus",
        "price",
        "totalprice",
        "discount",
        "description",
      ],

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Brands,
          as: "brand",
          attributes: ["id", "name", "icon"],
        },
        {
          model: Reviews,
          as: "reviews",
          attributes: ["name", "imagesUrl", "rating", "review", "created"],
        },
      ],

      where: filter,
      offset,
      limit: pageLimit,
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.FOUND,
      data: rows,
      total: count,
      limit: req.pagination.limit,
      pageCount: Math.ceil(count / req.pagination.limit),
      page: req.pagination.offset / req.pagination.limit + 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

const getOne = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Product.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "coverImage",
        "otherImages",
        "stock",
        "stockStatus",
        "price",
        "totalprice",
        "discount",
        "description",
      ],

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Brands,
          as: "brand",
          attributes: ["id", "name", "icon"],
        },
        {
          model: Reviews,
          as: "reviews",
          attributes: ["name", "imagesUrl", "rating", "review", "created"],
        },
      ],
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.FOUND,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const del = asyncErrorHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params?.id },
  });

  if (!product) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "No record found against the id for deletion.",
    });
  }

  // Collect all images paths to delete
  const imagePaths = [];

  if (product.coverImage) {
    imagePaths.push(`./public/${product.coverImage}`);
  }
  if (product.otherImages && Array.isArray(product.otherImages)) {
    product.otherImages.forEach((img) => {
      imagePaths.push(`./public/${img}`);
    });
  }

  // Delete product from DB
  await Product.destroy({
    where: { id: req.params?.id },
  });

  // Delete files
  for (const path of imagePaths) {
    try {
      await fs.unlink(path);
      console.log(`Deleted file: ${path}`);
    } catch (err) {
      console.error(`Failed to delete file ${path}:`, err);
    }
  }

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    message: TEXTS.DELETED,
  });
});

// add to cart
const addToCart = asyncErrorHandler(async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.body.productId },
    });

    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id for deletion.",
      });
    }

    console.log("i am here");

    // check stock status
    if (product.stockStatus === "out_of_stock") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Product is out of stock.",
      });
    }

    let price = product.totalprice * req.body.quantity;

    const data = await Cart.create({
      productId: req.body.productId,
      quantity: req.body.quantity,
      price,
    });

    console.log("i am here", data);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Product added to cart successfully.",
      cartId: data.id,
      price: price,
      product: {
        name: product.name,
        coverImage: product.coverImage,
        stock: product.stock,
        stockStatus: product.stockStatus,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update add to cart
const updateCart = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      where: { id },
    });

    if (!cart) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id.",
      });
    }

    const product = await Product.findOne({
      where: { id: cart.productId },
    });

    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id for deletion.",
      });
    }

    console.log("product", product);

    let price = product.totalprice * quantity;

    await Cart.update(
      {
        quantity,
        price,
      },
      {
        where: { id },
      }
    );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Product updated successfully.",
      cartId: id,
      price: price,
      product: {
        name: product.name,
        coverImage: product.coverImage,
        stock: product.stock,
        stockStatus: product.stockStatus,
      },
    });
  } catch (error) {
    console.error("Error updating to cart:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// show cart items
const showCartItems = asyncErrorHandler(async (req, res) => {
  try {
    const { cartIds } = req.body;

    if (!cartIds) {
      return res.status(400).json({
        success: false,
        message: "cartIds is required",
      });
    }

    if (typeof cartIds === "undefined") {
      return res.status(400).json({
        success: false,
        message: "cartIds key is missing in request body",
      });
    }

    if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "cartIds must be a non-empty array.",
      });
    }

    const { count, rows } = await Cart.findAndCountAll({
      where: {
        id: { [Op.in]: cartIds },
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "coverImage",
            "otherImages",
            "stock",
            "stockStatus",
          ],
          include: [
            {
              model: Category,
              as: "category",
            },
            {
              model: Brands,
              as: "brand",
            },
          ],
        },
      ],
      ...req.pagination,
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.FOUND,
      totalPrice: rows.reduce((total, item) => total + item.price, 0),
      data: rows,
      total: count,
      limit: req.pagination.limit,
      pageCount: Math.ceil(count / req.pagination.limit),
      page: req.pagination.offset / req.pagination.limit + 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// remove cart item
const removeCartItem = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const cartItem = await Cart.findOne({
    where: { id },
  });

  if (!cartItem) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "No cart item found against the id for deletion.",
    });
  }

  await Cart.destroy({
    where: { id },
  });

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    message: TEXTS.DELETED,
  });
});

// checkout
const checkout = asyncErrorHandler(async (req, res) => {
  try {
    const { name, email, address, phone, products } = req.body;

    let orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const checkout = await Checkout.create({
      name,
      email,
      address,
      phone,
      orderId,
    });

    const items = await Promise.all(
      products.map(async (p) => {
        const product = await Product.findByPk(p.productId);
        const cartItem = await Cart.findOne({ where: { id: p.cartId } });
        const finalQuantity = p.quantity ?? cartItem.quantity;
        const totalPrice = finalQuantity * product.price;

        if (p.quantity && p.quantity !== cartItem.quantity) {
          await Cart.update(
            { quantity: finalQuantity },
            { where: { id: p.cartId } }
          );
        }

        // Reduce product stock
        const newStock = product.stock - finalQuantity;
        if (newStock < 0) {
          return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: `Insufficient stock for product ID ${p.productId}.`,
          });
        }
        await Product.update(
          {
            stock: newStock,
            stockStatus: newStock === 0 ? "out_of_stock" : "in_stock",
          },
          { where: { id: p.productId } }
        );

        return {
          checkoutId: checkout.id,
          productId: p.productId,
          cartId: p.cartId,
          quantity: finalQuantity,
          price: totalPrice,
        };
      })
    );

    await Checkout_Item.bulkCreate(items);

    res.status(201).json({
      success: true,
      message: "Checkout created successfully",
      data: { checkout, items },
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// show checkout orders
const showCheckoutOrders = asyncErrorHandler(async (req, res) => {
  try {
    const { status } = req.query;
    const { count, rows } = await Checkout.findAndCountAll({
      attributes: { exclude: ["deleted"] },
      include: [
        {
          model: Checkout_Item,
          as: "items",
          attributes: ["id", "quantity", "price", "created", "updated"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "coverImage", "price"],
            },
          ],
        },
      ],
      where: status ? { status } : null,
      ...req.pagination,
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.FOUND,
      data: rows,
      total: count,
      limit: req.pagination.limit,
      pageCount: Math.ceil(count / req.pagination.limit),
      page: req.pagination.offset / req.pagination.limit + 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// cancel order
const cancelOrder = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Checkout.findByPk(id);

    if (!order) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No order found against the id for cancellation.",
      });
    }

    if (order.status === "shipped") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Order has been shipped and cannot be cancelled.",
      });
    } else if (order.status === "delivered") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Order has been delivered and cannot be cancelled.",
      });
    } else if (order.status === "cancelled") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Order is already cancelled.",
      });
    }

    //  Get all items for this checkout
    const items = await Checkout_Item.findAll({
      where: { checkoutId: id },
    });

    //  Update stock for each product
    for (const item of items) {
      await Product.increment(
        { stock: item.quantity },
        { where: { id: item.productId } }
      );
    }

    //  Update order status
    await Checkout.update(
      { status: "cancelled", cancelReason, updated: new Date() },
      { where: { id } }
    );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Order cancelled and stock updated successfully.",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// change order
const changeOrderStatus = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const order = await Checkout.findByPk(id);

    if (!order) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No order found against the given ID.",
      });
    }

    if (order.status === "shipped") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Order has been shipped and cannot be changed.",
      });
    }

    if (order.status === "delivered") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Order has been delivered and cannot be changed.",
      });
    }

    if (order.status === "cancelled") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Order is already cancelled.",
      });
    }

    const updateData = { status, updatedAt: new Date() };

    if (status === "cancelled") {
      updateData.cancelReason = reason || "No reason provided";
    }

    await Checkout.update(updateData, { where: { id } });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: `Order status updated to ${status} successfully.`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  create,
  update,
  get,
  getByCategory,
  getOne,
  del,
  addToCart,
  updateCart,
  showCartItems,
  removeCartItem,
  checkout,
  showCheckoutOrders,
  cancelOrder,
  changeOrderStatus,
};
