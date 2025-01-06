const mongoose = require("mongoose");
const UserRole = require("../utils/UserRole");
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		role: {
			type: String,
			enum: [UserRole.USER, UserRole.ADMIN],
			default: UserRole.USER,
		},
		avatar: {
			type: Object,
			default: {
				url: "Uploads/User/images.png",
				publicId: null,
			},
		},
		bio: {
			type: String,
			default: "No bio",
		},
		isAccountVerified: {
			type: Boolean,
			default: false,
		},
		token: {
			type: String,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
userSchema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "user",
});
const User = mongoose.model("User", userSchema);

module.exports = User;
