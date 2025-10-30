const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Category, Brand, Product } = require("../../models");
const { Op } = require("sequelize");
const { handleFileUpload } = require("../../utils/fileUpload");
const fs = require("fs").promises

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
          if (filePath && typeof filePath === 'string') {
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
  const { name, description } = req.body;
  const { id } = req.params;

  const currentRecord = await Product.findByPk(id);

  if (!currentRecord) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: STATUS_CODES.NOT_FOUND,
    });
  }
  // check if the name is being updated to an existing record
  const isExist = await Product.findOne({
    where: {
      name,
      id: { [Op.ne]: id },
    },
  });

  if (isExist) {
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: "Product name already exist.",
    });
  }

  const [status, updatedData] = await Product.update(
    { name, description },
    {
      where: { id },
      returning: true,
    }
  );

  if (!status) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: 404,
      message: "Update failed",
    });
  }

  return res.status(STATUS_CODES.SUCCESS).json({
    success: STATUS_CODES.SUCCESS,
    message: "Record updated successfully",
    // data: updatedData[0], // Returning the updated Product data
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
    });
  }
});

const getOne = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Product.findOne({
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
  const deleted = await Product.destroy({
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
  update,
  get,
  getOne,
  del,
};
