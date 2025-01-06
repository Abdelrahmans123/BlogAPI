const multer = require("multer");
const path = require("path");
const AppError = require("../utils/AppError");
const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../uploads/Images/Posts"));
	},
	filename: (req, file, cb) => {
		const fileExtension = file.mimetype.split("/")[1];
		const fileName = `post-${Date.now()}.${fileExtension}`;
		cb(null, fileName);
	},
});
const upload = multer({
	storage: diskStorage,
});
module.exports = upload;
