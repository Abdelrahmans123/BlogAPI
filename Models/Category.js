const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
