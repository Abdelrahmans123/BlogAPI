const joi = require("joi");
function validatePost(post) {
	const schema = joi.object({
		title: joi.string().trim().min(3).max(50).empty().required().messages({
			"string.min": '"title" should have at least 3 characters',
			"string.empty": '"title" cannot be an empty field',
			"string.max": '"title" should have at most 50 characters',
			"any.required": '"title" is a required field',
		}),
		body: joi.string().trim().min(10).empty().required().messages({
			"string.min": '"description" should have at least 10 characters',
			"string.empty": '"description" cannot be an empty field',
			"any.required": '"description" is a required field',
		}),
		category: joi.string().trim().empty().required().messages({
			"string.empty": '"category" cannot be an empty field',
			"any.required": '"category" is a required field',
		}),
	});
	return schema.validate(post);
}
function validateUpdatePost(post) {
	const schema = joi.object({
		title: joi.string().trim().min(3).max(50).empty().messages({
			"string.min": '"title" should have at least 3 characters',
			"string.empty": '"title" cannot be an empty field',
			"string.max": '"title" should have at most 50 characters',
		}),
		body: joi.string().trim().min(10).empty().messages({
			"string.min": '"description" should have at least 10 characters',
			"string.empty": '"description" cannot be an empty field',
		}),
		category: joi.string().trim().empty().messages({
			"string.empty": '"category" cannot be an empty field',
		}),
	});
	return schema.validate(post);
}
module.exports = { validatePost, validateUpdatePost };
