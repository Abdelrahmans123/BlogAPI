const AppError = require("../utils/AppError");

const AllowedTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			const error = AppError.create(
				"You are not allowed to perform this action",
				403
			);
			return next(error);
		}
		next();
	};
};
module.exports = AllowedTo;
