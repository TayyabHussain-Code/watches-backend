const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Media_Link } = require("../../models");
const { Op, Sequelize } = require("sequelize"); 
const fs = require("fs").promises;
const path = require("path");

const create = asyncErrorHandler(async (req, res) => {
  const uploadedFilePaths = [];
  try {
    let icon = null;

    // Handle icon upload
    if (req.file) {
      icon = `/images/${req.file.filename}`;
      uploadedFilePaths.push(req.file.path);
    }

    const isExist = await Media_Link.findOne({
      where: {
        name: req?.body.name,
      },
    });

    if (isExist) {
      // Cleanup
      if (uploadedFilePaths.length > 0) {
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

      return res.status(STATUS_CODES.CONFLICT).json({
        success: false,
        message: "Media_Link already exist.",
      });
    }

    // creating data
    const data = await Media_Link.create({
      ...req.body,
      icon,
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: TEXTS.CREATED,
      data: data,
    });
  } catch (error) {
    console.error("Error creating Media_Link:", error);

    // Rollback: Delete uploaded file on error
    if (uploadedFilePaths.length > 0) {
      console.log("Rolling back uploaded file...");
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

const get = asyncErrorHandler(async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Media_Link.findAndCountAll({
      
      where: filter,
      ...req.pagination,
      order: [["created", "ASC"]],
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

    const data = await Media_Link.findOne({
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
// Delete single icon from Media_Link
const deleteIcon = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const mediaLink = await Media_Link.findOne({
      where: { id },
    });

    if (!mediaLink) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id.",
      });
    }

    if (!mediaLink.icon) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No icon found for this media link.",
      });
    }

    // Get file path
    const imagePath = `./public${mediaLink.icon}`;

    // Delete file from filesystem
    try {
      await fs.unlink(imagePath);
      console.log(`Deleted file: ${imagePath}`);
    } catch (err) {
      console.error(`Failed to delete file ${imagePath}:`, err);
      // Continue even if file deletion fails
    }

    // Update media_link - set icon to null
    await Media_Link.update(
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
    const mediaLink = await Media_Link.findOne({
      where: { id: req.params?.id },
    });

    if (!mediaLink) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No record found against the id for deletion.",
      });
    }

    // Delete icon file if exists
    if (mediaLink.icon) {
      try {
        const imagePath = `./public${mediaLink.icon}`;
        await fs.unlink(imagePath);
        console.log(`Deleted file: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete file:`, err);
      }
    }

    // Delete record from DB
    await Media_Link.destroy({
      where: { id: req.params?.id },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: TEXTS.DELETED,
    });
  } catch (error) {
    console.error("Error deleting media link:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = {
  create,
  get,
  getOne,
  del,
};
