const asyncHandler = require("../../Middleware/asyncWrapper");
const AppError = require("../../utils/AppError");
const HTTPStatusText = require("../../utils/HTTPStatusText");
const Category = require("../../Models/Category");
const {
	validateCategory,
	validateUpdateCategory,
} = require("../../validations/category");
const asyncWrapper = require("../../Middleware/asyncWrapper");
/**
-----------------------------------------------------------------
 * @desc Get All Categories
 * @route GET /api/categories
 * @access Public
----------------------------------------------------------------
 */
const index = asyncWrapper(async (req, res, next) => {
    ffff
	const categories = await Category.find(
		{},
		{
			__v: 0,
		}
	).populate("user", {
		__v: 0,
		password: 0,
		role: 0,
		token: 0,
	});
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			categories,
		},
	});
});
/**
-----------------------------------------------------------------
 * @desc Create a new Category
 * @route POST /api/categories
 * @access Private/Admin
----------------------------------------------------------------
 */
const store = asyncWrapper(async (req, res, next) => {
	const { name } = req.body;
	const { error } = validateCategory(req.body);
	if (error) {
		const validationError = AppError.create(error.details[0].message, 400);
		return next(validationError);
	}
	const category = await Category.create({ name, user: req.user.id });
	res.status(201).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			category,
		},
	});
});
/**
-----------------------------------------------------------------
 * @desc Delete a category
 * @route Delete /api/categories/:id
 * @access Private/Admin
----------------------------------------------------------------
 */
const destroy = asyncWrapper(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		const notFoundError = AppError.create("Category not found", 404);
		return next(notFoundError);
	}
	await Category.findByIdAndDelete(id);
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: null,
	});
});
module.exports = {
	index,
	store,
	destroy,
};
