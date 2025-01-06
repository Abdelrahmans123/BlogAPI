const cloudinary = require("cloudinary").v2;
const asyncHandler = require("../Middleware/asyncWrapper");
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryImageUpload = async (imagePath) => {
	try {
		const data = await cloudinary.uploader.upload(imagePath, {
			resource_type: "auto",
		});
		return data;
	} catch (error) {
		throw new Error(error);
	}
};
const cloudinaryImageDelete = asyncHandler(async (publicId) => {
	const data = await cloudinary.uploader.destroy(publicId);
	return data;
});
const cloudinaryMultipleImageDelete = asyncHandler(async (publicIds) => {
	const data = await cloudinary.v2.api.delete_resources(publicIds);
	return data;
});
module.exports = {
	cloudinaryImageUpload,
	cloudinaryImageDelete,
	cloudinaryMultipleImageDelete,
};
