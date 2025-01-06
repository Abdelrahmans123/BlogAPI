const joi = require("joi");
function validateUser(user) {
	const schema = joi.object({
		email: joi.string().email().required().empty().messages({
			"string.email": '"email" must be a valid email',
			"string.empty": '"email" cannot be an empty field',
			"any.required": '"email" is a required field',
		}),
		password: joi.string().min(8).required().empty().messages({
			"string.min": '"password" should have at least 8 characters',
			"string.empty": '"password" cannot be an empty field',
			"any.required": '"password" is a required field',
		}),
	});
	return schema.validate(user);
}
module.exports = validateUser;
