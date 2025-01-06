const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const VerifyToken = async (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		const error = AppError.create("Unauthorized", 401);
		return next(error);
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		const error = AppError.create("Unauthorized", 401);
		return next(error);
	}
	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
		if (err) {
			const error = AppError.create("Unauthorized", 401);
			return next(error);
		}
		req.user = decoded;
		next();
	});
};
module.exports = VerifyToken;
