const fs = require("fs");
const path = require("path");
const asyncHandler = require("../../Middleware/asyncWrapper");
const User = require("../../Models/User");
const Post = require("../../Models/Post");
const Comment = require("../../Models/Comment");
const AppError = require("../../utils/AppError");
const HTTPStatusText = require("../../utils/HTTPStatusText");
const validateUser = require("../../validations/user");
const {
	cloudinaryImageUpload,
	cloudinaryImageDelete,
	cloudinaryMultipleImageDelete,
} = require("../../utils/cloudinary");
/**
----------------------------------------------------------------
* @desc Get all users
* @route GET /api/users
* @access Private/Admin
----------------------------------------------------------------
*/
const index = asyncHandler(async (req, res, next) => {
	const users = await User.find({}, { __v: false, password: false }).populate(
		"posts"
	);
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: { users },
	});
});
/**
 ----------------------------------------------------------------
* @desc Get a user by id
* @route GET /api/users/:id
* @access Private/User
* Logged in user can get his profile
* @access Private/Admin
* Admin can get any user
----------------------------------------------------------------
*/
const show = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id, {
		__v: false,
		password: false,
	}).populate("posts");
	if (!user) {
		const error = AppError.create("User not found", 404);

		return next(error);
	}
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: { user },
	});
});
/**
----------------------------------------------------------------
* @desc Update user
* @route PUT /api/users/:id
* @access Private/User 
----------------------------------------------------------------
*/
const update = asyncHandler(async (req, res, next) => {
	const { error } = validateUser(req.body);
	if (error) {
		const error = AppError.create(error.details[0].message, 400);
		return next(error);
	}
	if (req.body.password) {
		const error = AppError.create("You can't change password here", 400);
		return next(error);
	}
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: req.body,
		},
		{ new: true }
	).select("-__v -password");
	if (!user) {
		const error = AppError.create("User not found", 404);
		return next(error);
	}
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: { user },
	});
});
/**
----------------------------------------------------------------
* @desc Delete user
* @route DELETE /api/users/:id
* @access  Private/Admin/User - User can delete himself
----------------------------------------------------------------
*/
const destroy = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		const error = AppError.create("User not found", 404);
		return next(error);
	}
	const posts = await Post.findById({ user: user._id });
	const publicIds = posts?.map((post) => post.image.public_id);
	if (publicIds?.length > 0) {
		await cloudinaryMultipleImageDelete(publicIds);
	}
	await cloudinaryImageDelete(user.avatar.publicId);
	await Post.deleteMany({ user: req.params.id });
	await Comment.deleteMany({ author: req.params.id });
	await User.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: null,
	});
});
/**
----------------------------------------------------------------
* @desc Count user
* @route Get /api/users/count	
* @access Private/Admin
----------------------------------------------------------------

*/
const count = asyncHandler(async (req, res, next) => {
	const count = await User.countDocuments();
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: { count },
	});
});
/**
----------------------------------------------------------------
* @desc upload user image
* @route PUT /api/users/upload
* @access Private/User
* Logged in user can upload his avatar
----------------------------------------------------------------
*/
const upload = asyncHandler(async (req, res, next) => {
	if (!req.file) {
		const fileError = AppError.create("Please upload a file", 400);
		return next(fileError);
	}

	// Find the user to get the current avatar path
	const user = await User.findById(req.user.id).select("-__v -password");
	if (!user) {
		const error = AppError.create("User not found", 404);
		return next(error);
	}

	const imagePath = path.join(
		__dirname,
		"../uploads/Images/User",
		req.file.filename
	);

	const data = await cloudinaryImageUpload(imagePath);
	if (user.avatar.publicId) {
		await cloudinaryImageDelete(user.avatar.publicId);
	}
	// Update the user's avatar
	user.avatar = {
		url: data.secure_url,
		publicId: data.public_id,
	};
	await user.save();
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			user: {
				avatar: {
					url: data.secure_url,
					publicId: data.public_id,
				},
			},
		},
	});
});

module.exports = {
	index,
	show,
	update,
	destroy,
	count,
	upload,
};
