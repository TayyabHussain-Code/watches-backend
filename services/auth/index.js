const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Brands } = require("../../models");
const { Op } = require("sequelize");

const login = asyncErrorHandler(async (req, res) => {
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

    const data = await Brands.create({ ...req.body });

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


module.exports = {
  login,
  
};
