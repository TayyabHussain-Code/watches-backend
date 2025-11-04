const fs = require("fs");
const path = require("path");

async function handleFileUpload(file, folderName = "image") {
  if (!file) {
    return {
      success: false,
      statusCode: 400,
      message: "File is required.",
    };
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml", "image/webp"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      success: false,
      statusCode: 400,
      message: "File must be jpeg, png, jpg, webp or svg.",
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      success: false,
      statusCode: 400,
      message: "File size must be less than 5MB.",
    };
  }

  // Create /public/image folder if it doesn't exist
  const uploadDir = path.join(__dirname, "../public", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate new unique file name
  const timestamp = Date.now();
  const newFileName = `${timestamp}-${file.originalname}`;
  const newFilePath = path.join(uploadDir, newFileName);

  // Move file from Multer's temp folder to /public/image
  fs.renameSync(file.path, newFilePath);

  const fileUrl = `/public/${folderName}/${newFileName}`;

  return {
    success: true,
    statusCode: 200,
    message: "File uploaded successfully.",
    fileUrl,
    fileName: newFileName,
  };
}

module.exports = { handleFileUpload };
