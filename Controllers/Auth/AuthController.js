const asyncHandler = require("../../Middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Models/User");
const validateRegisterUser = require("../../validations/register");
const validateLoginUser = require("../../validations/login");
const AppError = require("../../utils/AppError");
const HTTPStatusText = require("../../utils/HTTPStatusText");
const GenerateJWT = require("../../utils/GenerateJWT");
/*
----------------------------------------------------------------
* @desc Register a new user
* @route POST /auth/register
* @access Public
----------------------------------------------------------------

*/
const register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const { error } = validateRegisterUser(req.body);
	if (error) {
		const appError = AppError.create(error.details[0].message, 400);
		return next(appError);
	}
	const userExists = await User.findOne({ email });
	if (userExists) {
		const appError = AppError.create("User already exists", 400);
		return next(appError);
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = new User({
		name,
		email,
		role,
		password: hashedPassword,
	});
	const token = await GenerateJWT({
		id: user._id,
		email: user.email,
		role: user.role,
		name: user.name,
	});
	user.token = token;

	await user.save();
	res.status(201).json({
		status: HTTPStatusText.SUCCESS,
		message: "User created successfully",
		data: user,
	});
});
/*
----------------------------------------------------------------
* @desc Login a user
* @route POST /auth/login
* @access Public
----------------------------------------------------------------
*/
const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	const { error } = validateLoginUser(req.body);
	if (error) {
		const appError = AppError.create(error.details[0].message, 400);
		return next(appError);
	}
	const user = await User.findOne({ email });
	if (!user) {
		const appError = AppError.create("Invalid email or password", 400);
		return next(appError);
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		const appError = AppError.create("Invalid email or password", 400);
		return next(appError);
	}
	const token = await GenerateJWT({
		id: user._id,
		email: user.email,
		role: user.role,
		name: user.name,
	});

	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		message: "User logged in successfully",
		data: {
			token,
		},
	});
});
module.exports = {
	register,
	login,
};
