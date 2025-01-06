const AppError = require("../utils/AppError");

const Authorization = (req, res, next) => {
	if (req.user.role === "admin" || req.user.id === req.params.id) {
		next();
	} else {
		const error = AppError.create(
			"You are not allowed to perform this action",
			403
		);
		return next(error);
	}
};
module.exports = Authorization;
