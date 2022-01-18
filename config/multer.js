const multer = require("multer");
const upload = multer();

//upload setup
const uploadImage = upload.single("file");

module.exports = uploadImage;