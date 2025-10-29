const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const {  } = require('../../models');
const {  } = require('sequelize');


const create= asyncErrorHandler(async (req, res) => {
//   const isExist = await ModelName.findOne({
//     where:{
//       name : req?.body.name
//     },
//     raw : true
//   });

  if(isExist){
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: 409,
      message: "Category already exist.",
    });
  }

//   const data = await ModelName.create({...req.body});

  res.status(STATUS_CODES.CREATED).json({
    statusCode: 201,
    message: TEXTS.CREATED,
    // data: data
  });

 });

 const update = asyncErrorHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  
//   const currentCategory = await ModelName.findByPk(id);

  if (!currentCategory) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: 404,
      message: STATUS_CODES.NOT_FOUND,
    });
  }
  
//   const [status, updatedData] = await ModelName.update(
//     { name, description }, 
//     {
//       where: { id },
//       returning: true, 
//     }
//   );

//   if (!status) {
//     return res.status(STATUS_CODES.NOT_FOUND).json({
//       statusCode: 404,
//       message: "Update failed",
//     });
//   }

  return res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: "Category updated successfully",
    // data: updatedData[0], // Returning the updated category data
  });
});


const get = asyncErrorHandler(async(req,res)=>{  

  const {name} = req.query;

  let filter = {};

  if(name){
    filter.name = { [Op.iLike]: `%${name}%` }
  }

//   const {count , rows} = await ModelName.findAndCountAll({
//     where: filter,
//     ...req.pagination
//   });

    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: 200,
      message: TEXTS.FOUND,
    
    });
});

const del = asyncErrorHandler(async(req,res)=>{

    // const deleted = await ModelName.destroy({
    //   where: {
    //     id: req.params?.id
    //   }
    // });

    // if(!deleted){
    //   return res.status(STATUS_CODES.NOT_FOUND).json({
    //     statusCode: 404,
    //     message: "No record found against the categoryId for deletion.",
    //   });
    // }

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: 200,
    message: TEXTS.DELETED,
  });

});

module.exports = {
  create,
  update,
  get,
  del
};
