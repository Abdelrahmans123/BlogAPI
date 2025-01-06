const fs = require("fs");
const path = require("path");
const asyncHandler = require("../../Middleware/asyncWrapper");
const Post = require("../../Models/Post");
const Comment = require("../../Models/Comment");
const AppError = require("../../utils/AppError");
const HTTPStatusText = require("../../utils/HTTPStatusText");
const { validatePost, validateUpdatePost } = require("../../validations/post");
const {
	cloudinaryImageUpload,
	cloudinaryImageDelete,
} = require("../../utils/cloudinary");
/**
----------------------------------------------------------------
* @desc Get all posts
* @route GET /api/posts
* @access Public
----------------------------------------------------------------
*/
const index = asyncHandler(async (req, res, next) => {
	const query = req.query;
	let posts;
	const limit = query.limit || null;
	const page = query.page || null;
	const skip = (page - 1) * limit;
	const category = query.category || null;
	if (skip < 0) {
		const error = AppError.create("Page does not exist", 400);
		return next(error);
	}
	if (page && limit) {
		posts = await Post.find({}, { __v: false })
			.limit(limit)
			.skip(skip)
			.populate("user", ["-password", "-role", "-token", "-__v"])
			.populate("comments")
			.sort({ createdAt: -1 });
	} else if (category) {
		posts = await Post.find({ category }, { __v: false })
			.populate("user", ["-password", "-role", "-token", "-__v"])
			.sort({ createdAt: -1 });
	} else {
		posts = await Post.find({}, { __v: false })
			.populate("user", ["-password", "-role", "-token", "-__v"])
			.populate("comments")
			.sort({ createdAt: -1 });
	}
	if (posts.length === 0) {
		const error = AppError.create("No posts found", 404);
		return next(error);
	}
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			posts,
		},
	});
});
/**
----------------------------------------------------------------
* @desc Get post by id
* @route GET /api/posts/:id
* @access Public
----------------------------------------------------------------
*/
const show = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findById(id)
		.populate("user", ["-password", "-role", "-token", "-__v"])
		.populate("comments");
	if (!post) {
		const error = AppError.create("Post not found", 404);
		return next(error);
	}
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			post,
		},
	});
});
/**
----------------------------------------------------------------
* @desc Count post
* @route GET /api/posts/count
* @access Public
----------------------------------------------------------------
*/
const count = asyncHandler(async (req, res, next) => {
	const count = await Post.countDocuments();
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			count,
		},
	});
});
/**
----------------------------------------------------------------
* @desc Create new post
* @route POST /api/posts
* @access Private/User 
* Logged in user can create a new post
----------------------------------------------------------------
*/
const store = asyncHandler(async (req, res, next) => {
	const { title, body, category } = req.body;
	if (!req.file) {
		const fileError = AppError.create("Please upload a file", 400);
		return next(fileError);
	}
	const { error } = validatePost(req.body);
	if (error) {
		const validationError = AppError.create(error.details[0].message, 400);
		return next(validationError);
	}
	const imagePath = path.join(
		__dirname,
		`../../uploads/images/Posts/${req.file.filename}`
	);
	const image = await cloudinaryImageUpload(imagePath);
	const post = await Post.create({
		title,
		body,
		category,
		image: {
			url: image.secure_url,
			publicId: image.public_id,
		},
		user: req.user.id,
	});
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
	res.status(201).json({
		status: HTTPStatusText.SUCCESS,
		data: { post },
	});
});
/**
----------------------------------------------------------------
* @desc Update post
* @route PUT /api/posts/:id
* @access Private/User
* Logged in user can update his/her post
----------------------------------------------------------------
*/
const update = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { title, body, category } = req.body;
	const { error } = validateUpdatePost(req.body);
	if (error) {
		const validationError = AppError.create(error.details[0].message, 400);
		return next(validationError);
	}
	const post = await Post.findById(id);
	if (!post) {
		const error = AppError.create("Post not found", 404);
		return next(error);
	}
	if (post.user.toString() !== req.user.id) {
		const error = AppError.create("You are not authorized", 403);
		return next(error);
	}
	const updatedPost = await Post.findByIdAndUpdate(
		id,
		{
			title,
			body,
			category,
		},
		{ new: true }
	).populate("user", ["-password", "-role", "-token", "-__v"]);
	if (req.file) {
		if (post.image.publicId) {
			await cloudinaryImageDelete(post.image.publicId);
		}
		const imagePath = path.join(
			__dirname,
			`../../uploads/images/Posts/${req.file.filename}`
		);
		const image = await cloudinaryImageUpload(imagePath);
		updatedPost.image = {
			url: image.secure_url,
			publicId: image.public_id,
		};
		await updatedPost.save();

		if (fs.existsSync(imagePath)) {
			fs.unlinkSync(imagePath);
		}
	}
	return res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			post: updatedPost,
		},
	});
});
/**
----------------------------------------------------------------
* @desc Delete post
* @route DELETE /api/posts/:id
* @access Private/User
* Logged in user can delete his/her post
* @access Private/Admin
* Admin can delete any post
----------------------------------------------------------------
*/
const destroy = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (!post) {
		const error = AppError.create("Post not found", 404);
		return next(error);
	}
	if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
		const error = AppError.create("You are not authorized", 403);
		return next(error);
	}
	if (post.image.publicId) {
		await cloudinaryImageDelete(post.image.publicId);
	}
	await Post.findByIdAndDelete(id);
	await Comment.deleteMany({ postId: id });
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: null,
	});
});
/**
----------------------------------------------------------------
* @desc Toggle Like 
* @route PUT /api/posts/like/:id
* @access Private/User
* Logged in user can toggle like on a post
----------------------------------------------------------------
*/
const toggleLike = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (!post) {
		const error = AppError.create("Post not found", 404);
		return next(error);
	}
	const isLiked = post.likes.includes(req.user.id);
	if (isLiked) {
		post.likes = post.likes.filter(
			(userId) => userId.toString() !== req.user.id
		);
	} else {
		post.likes.push(req.user.id);
	}
	await post.save();
	res.status(200).json({
		status: HTTPStatusText.SUCCESS,
		data: {
			post,
		},
	});
});
module.exports = {
	index,
	show,
	count,
	store,
	update,
	destroy,
	toggleLike,
};
