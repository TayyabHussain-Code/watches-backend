
const fs = require('fs').promises;

const validate = (schema) => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {

      const firstError = error.details[0].message;

      // Validation fail files delete 
      if (req.files && req.files.length > 0) {
        console.log('Validation failed. Deleting uploaded files...');
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
            console.log(`Deleted file: ${file.path}`);
          } catch (unlinkError) {
            console.error(`Failed to delete file ${file.path}:`, unlinkError);
          }
        }
      }
      
      return res.status(400).json({
        success: false,
        message: firstError  
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {validate};