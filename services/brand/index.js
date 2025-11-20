const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Brands } = require("../../models");
const { Op } = require("sequelize");
const fs = require("fs").promises;
const path = require("path");

const create = asyncErrorHandler(async (req, res) => {
  try {
    const isExist = await Brands.findOne({
      where: {
        name: req?.body.name,
      },
    });

    if (isExist) {
      return res.status(STATUS_CODES.CONFLICT).json({
        success: false,
        message: "Brand already exist.",
      });
    }
     let icon = null;
    if (req.file) {
      icon = `/images/${req.file.filename}`;
    } 

    const data = await Brands.create({ ...req.body, icon });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: TEXTS.CREATED,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

const update = asyncErrorHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  const currentRecord = await Brands.findByPk(id);

  if (!currentRecord) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: STATUS_CODES.NOT_FOUND,
    });
  }   

  // check if the name is being updated to an existing brand name
  const isExist = await Brands.findOne({
    where: {
      name,
      id: { [Op.ne]: id }, 
    },
  });

  if (isExist) {
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: "Brand name already exist.",
    });
  }

  const [status, updatedData] = await Brands.update(
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
    // data: updatedData[0], // Returning the updated category data
  });
});

const get = asyncErrorHandler(async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Brands.findAndCountAll({
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

    const data = await Brands.findOne({
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
      message: "Internal Server Error",
    });
  }
});

// Delete single icon from Media_Link
const deleteIcon = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brands.findOne({
      where: { id },
    });

    if (!brand) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id.",
      });
    }

    if (!brand.icon) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No icon found for this media link.",
      });
    }

    // Get file path
    const imagePath = `./public${brand.icon}`;

    // Delete file from filesystem
    try {
      await fs.unlink(imagePath);
      console.log(`Deleted file: ${imagePath}`);
    } catch (err) {
      console.error(`Failed to delete file ${imagePath}:`, err);
      // Continue even if file deletion fails
    }

    // Update media_link - set icon to null
    await Brands.update(
      { icon: null },
      { where: { id } }
    );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.DELETED,
    });
  } catch (error) {
    console.error("Error deleting icon:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Delete entire Media_Link record
const del = asyncErrorHandler(async (req, res) => {
  try {
    const brands = await Brands.findOne({
      where: { id: req.params?.id },
    });

    if (!brands) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id for deletion.",
      });
    }

    // Delete icon file if exists
    if (brands.icon) {
      try {
        const imagePath = `./public${brands.icon}`;
        await fs.unlink(imagePath);
        console.log(`Deleted file: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete file:`, err);
      }
    }

    // Delete record from DB
    await Brands.destroy({
      where: { id: req.params?.id },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.DELETED,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}); 


module.exports = {
  create,
  update,
  get,
  getOne,
  del,
};
