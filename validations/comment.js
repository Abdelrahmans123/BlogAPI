const joi = require("joi");

function validateComment(comment) {
	const schema = joi.object({
		comment: joi.string().min(1).required().empty().messages({
			"string.min": '"comment" should have at least 1 character',
			"string.empty": '"comment" cannot be an empty field',
			"any.required": '"comment" is a required field',
		}),
		postId: joi.string().required().empty().messages({
			"string.empty": '"postId" cannot be an empty field',
			"any.required": '"postId" is a required field',
		}),
	});
	return schema.validate(comment);
}
function validateUpdateComment(comment) {
	const schema = joi.object({
		comment: joi.string().min(1).empty().messages({
			"string.min": '"comment" should have at least 1 character',
			"string.empty": '"comment" cannot be an empty field',
			"any.required": '"comment" is a required field',
		}),
		postId: joi.string().empty().messages({
			"string.empty": '"postId" cannot be an empty field',
			"any.required": '"postId" is a required field',
		}),
	});
	return schema.validate(comment);
}
module.exports = {
	validateComment,
	validateUpdateComment,
};
