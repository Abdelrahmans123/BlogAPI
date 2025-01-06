const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
