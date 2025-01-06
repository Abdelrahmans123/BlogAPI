const multer = require("multer");
const path = require("path");
const AppError = require("../utils/AppError");
const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../uploads/Images/User"));
	},
	filename: (req, file, cb) => {
		const fileExtension = file.mimetype.split("/")[1];
		const fileName = `user-${Date.now()}.${fileExtension}`;
		cb(null, fileName);
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype.split("/")[0] === "image") {
		cb(null, true);
	} else {
		cb(AppError.create("Invalid file type", 400), false);
	}
};
const upload = multer({
	storage: diskStorage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});
module.exports = upload;
