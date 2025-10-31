const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Category, Brands, Product, Cart } = require("../../models");
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
      req.body.price = Math.round(
        parseFloat(req.body.price) * (1 - parseFloat(req.body.discount) / 100)
      );
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
      error : error.message,
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

    let price = product.price * req.body.quantity;

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

// show cart items
const showCartItems = asyncErrorHandler(async (req, res) => {
  try {
    const { cartIds } = req.body;

    console.log("cartIds", cartIds);

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

module.exports = {
  create,
  update,
  get,
  getOne,
  del,
  addToCart,
  showCartItems,
};
