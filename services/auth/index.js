const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { User } = require("../../models");
const { Op } = require("sequelize");
const { generateToken } = require("../../utils/jwtToken");
const bcrypt = require('bcrypt');

const login = asyncErrorHandler(async (req, res) => { 
    console.log('i am here')
  try {
      const {email, password} = req.body;
    const isExistUser = await User.findOne({
      where: { email: email },
    });
    if (!isExistUser) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }else if(isExistUser.role !== 'admin'){
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Unauthorized User",
      });
    }
    
    const isPassword = await bcrypt.compare(password, isExistUser.password);

    if(!isPassword){
         return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

     const token = generateToken(isExistUser);    

     // convert instance to plain object 
     const user = isExistUser.toJSON();


     delete user.password

     const data = {
       user:isExistUser,
       token:  token
     }
      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        user: user,
        token: token
      })
   
  } catch (err) {
    return error(res, "Failed to login user", [err.message], 500);
  }
});


module.exports = {
  login,
  
};
