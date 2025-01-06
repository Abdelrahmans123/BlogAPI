const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const VerifyObjectId = (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const error = AppError.create("Invalid ID", 400);
		return next(error);
	}
	next();
};
module.exports = VerifyObjectId;
