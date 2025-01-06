const joi = require("joi");
function validateUser(user) {
	const schema = joi.object({
		name: joi.string().min(3).empty().messages({
			"string.min": '"name" should have at least 3 characters',
			"string.empty": '"name" cannot be an empty field',
		}),
		email: joi.string().email().empty().messages({
			"string.email": '"email" must be a valid email',
			"string.empty": '"email" cannot be an empty field',
		}),
		bio: joi.string().empty().min(3).messages({
            "string.empty": '"bio" cannot be an empty field',
            "string.min": '"bio" should have at least 3 characters',
		}),
	});
	return schema.validate(user);
}
module.exports = validateUser;
