const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Category } = require("../../models");
const { Op } = require("sequelize");

const create = asyncErrorHandler(async (req, res) => {
  try {
    const isExist = await Category.findOne({
      where: {
        name: req?.body.name,
      },
    });

    if (isExist) {
      return res.status(STATUS_CODES.CONFLICT).json({
        success: false,
        message: "Category already exist.",
      });
    }

    const data = await Category.create({ ...req.body });

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

  const currentRecord = await Category.findByPk(id);

  if (!currentRecord) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: STATUS_CODES.NOT_FOUND,
    });
  } 
   // check if the name is being updated to an existing record
  const isExist = await Category.findOne({
    where: {
      name,
      id: { [Op.ne]: id }, 
    },
  });

  if (isExist) {
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: "category name already exist.",
    });
  }

  const [status, updatedData] = await Category.update(
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

    const { count, rows } = await Category.findAndCountAll({
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

    const data = await Category.findOne({
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
  const deleted = await Category.destroy({
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
