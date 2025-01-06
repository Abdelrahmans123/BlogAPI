const Comment = require("../../Models/Comment");
const {
	validateComment,
	validateUpdateComment,
} = require("../../validations/Comment");
const asyncHandler = require("../../Middleware/asyncWrapper");
const AppError = require("../../utils/AppError");
const HTTPStatusText = require("../../utils/HTTPStatusText");
const User = require("../../Models/User");
/**
-----------------------------------------------------------------
 * @desc Get All Comments
 * @route GET /api/comments
 * @access Private/Admin
----------------------------------------------------------------
 */
const index = asyncHandler(async (req, res, next) => {
	const comments = await Comment.find().populate("author", [
		"-password",
		"-role",
		"-token",
		"-__v",
	]);
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			comments,
		},
	});
});
/**
----------------------------------------------------------------
* @desc Create New Comment
* @route POST /api/comments
* @access Private/User 
* Logged in user can create a new comment
----------------------------------------------------------------
*/
const store = asyncHandler(async (req, res, next) => {
	const { comment, postId } = req.body;
	const { error } = validateComment(req.body);
	if (error) {
		const validationError = AppError.create(error.details[0].message, 400);
		return next(validationError);
	}
	const user = await User.findById(req.user.id);
	const newComment = await Comment.create({
		comment,
		postId,
		author: req.user.id,
		userName: user.name,
	});
	res.status(201).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			comment: newComment,
		},
	});
});
/**
----------------------------------------------------------------
 * 	@desc Update Comment
 *  @route PUT /api/comments/:id
 *  @access Private/User
 * Logged in user can update his/her comment
----------------------------------------------------------------
 */
const update = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { comment } = req.body;
	const { error } = validateUpdateComment(req.body);
	if (error) {
		const validationError = AppError.create(error.details[0].message, 400);
		return next(validationError);
	}
	const commentToUpdate = await Comment.findById(id);
	if (!commentToUpdate) {
		const error = AppError.create("Comment not found", 404);
		return next(error);
	}
	if (commentToUpdate.author.toString() !== req.user.id) {
		const error = AppError.create("You are not authorized", 403);
		return next(error);
	}
	const updatedComment = await Comment.findByIdAndUpdate(
		id,
		{ comment },
		{ new: true }
	);
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			comment: updatedComment,
		},
	});
});

/**
----------------------------------------------------------------
 * @desc Delete Comment
 * @route DELETE /api/comments/:id
* @access Private/User
* Logged in user can delete his/her comment
* @access Private/Admin
* Admin can delete any comment
----------------------------------------------------------------
*/
const destroy = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const comment = await Comment.findById(id);
	if (!comment) {
		const error = AppError.create("Comment not found", 404);
		return next(error);
	}
	if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
		const error = AppError.create("You are not authorized", 403);
		return next(error);
	}
	await Comment.findByIdAndDelete(id);
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: null,
	});
});
module.exports = {
	index,
	store,
	update,
	destroy,
};
