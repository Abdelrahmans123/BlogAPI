const joi = require("joi");

function validateCategory(comment) {
	const schema = joi.object({
		name: joi.string().min(1).required().empty().messages({
			"string.min": '"name" should have at least 1 character',
			"string.empty": '"name" cannot be an empty field',
			"any.required": '"name" is a required field',
		}),
	});
	return schema.validate(comment);
}
function validateUpdateCategory(comment) {
	const schema = joi.object({
		name: joi.string().min(1).empty().messages({
			"string.min": '"name" should have at least 1 character',
			"string.empty": '"name" cannot be an empty field',
		}),
	});
	return schema.validate(comment);
}
module.exports = {
	validateCategory,
	validateUpdateCategory,
};
