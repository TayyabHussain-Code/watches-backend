const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Product, Reviews } = require("../../models");
const { Op } = require("sequelize");
const { handleFileUpload } = require("../../utils/fileUpload");

const fs = require("fs").promises;
const path = require("path");

const create = asyncErrorHandler(async (req, res) => {
  const uploadedFilePaths = [];
  try {
    const { productId } = req.body;

    const isExistProduct = await Product.findOne({ where: { id: productId } });
    if (!isExistProduct) {
      return res.status(STATUS_CODES.CONFLICT).json({
        success: false,
        message: "Product does not exist.",
      });
    }

    let imagesUrl = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUrl = `/images/${file.filename}`;
        imagesUrl.push(fileUrl);

        // Full path for safe deletion later
        const fullPath = path.join(__dirname, "../../public/images", file.filename);  
        uploadedFilePaths.push(fullPath);
      }
    }

    const review = await Reviews.create({
      ...req.body,
      imagesUrl,
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);

    if (uploadedFilePaths.length > 0) {
      for (const filePath of uploadedFilePaths) {
        try {
          await fs.unlink(filePath);
          console.log(`✅ Deleted file: ${filePath}`);
        } catch (deleteError) {
          console.error(`❌ Failed to delete file ${filePath}:`, deleteError.message);
        }
      }
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
// const update = asyncErrorHandler(async (req, res) => {
//   const { name, description } = req.body;
//   const { id } = req.params;

//   const currentRecord = await Category.findByPk(id);

//   if (!currentRecord) {
//     return res.status(STATUS_CODES.NOT_FOUND).json({
//       success: false,
//       message: STATUS_CODES.NOT_FOUND,
//     });
//   } 
//    // check if the name is being updated to an existing record
//   const isExist = await Category.findOne({
//     where: {
//       name,
//       id: { [Op.ne]: id }, 
//     },
//   });

//   if (isExist) {
//     return res.status(STATUS_CODES.CONFLICT).json({
//       success: false,
//       message: "category name already exist.",
//     });
//   }

//   const [status, updatedData] = await Category.update(
//     { name, description },
//     {
//       where: { id },
//       returning: true,
//     }
//   );

//   if (!status) {
//     return res.status(STATUS_CODES.NOT_FOUND).json({
//       success: 404,
//       message: "Update failed",
//     });
//   }

//   return res.status(STATUS_CODES.SUCCESS).json({
//     success: STATUS_CODES.SUCCESS,
//     message: "Record updated successfully",
//     // data: updatedData[0], // Returning the updated category data
//   });
// });

const get = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { count, rows } = await Reviews.findAndCountAll({
      attributes: ['id', 'name', 'rating', 'review', 'imagesUrl', 'created'],
      where: {
        productId: id
      },
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
    });
  }
});

const getOne = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Reviews.findOne({
       attributes: ['id', 'name', 'rating', 'review', 'imagesUrl', 'created'],
      where: { id },
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
  const deleted = await Reviews.destroy({
    where: {
      id: req.params?.id,
    },
  });

  if (!deleted) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "No record found against the id for deletion.",
    });
  }

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    message: TEXTS.DELETED,
  });
});

module.exports = {
  create,
  // update,
  get,
  getOne,
  del,
};
