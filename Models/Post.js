const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 50,
		},
		body: {
			type: String,
			required: true,
			trim: true,
			minLength: 10,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		image: {
			type: Object,
			default: {
				url: "",
				public_id: null,
			},
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
PostSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "postId",
});
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
