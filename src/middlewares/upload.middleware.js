const { upload } = require("../config/cloudinary");
module.exports = { uploadImages: upload.array("images", 6) };
