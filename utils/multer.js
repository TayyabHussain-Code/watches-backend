const multer = require("multer");
const path = require("path");
  
const tempDir = path.join(__dirname, "../public/images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = {upload};
