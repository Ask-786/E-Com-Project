const Joi = require("joi");

const validator = (schema) => {
  return (payload) => {
    return schema.validate(payload, { abortEarly: false });
  };
};

const signupSchema = Joi.object({
  fullname: Joi.string().min(3).required().messages({
    "string.base": `fullname should be a type of 'text'`,
    "string.empty": `fullname cannot be an empty field here`,
    "string.min": `fullname should have a minimum length of 3`,
    "any.required": `fullname is a required field`,
  }),
  username: Joi.string().min(3).max(12).required().messages({
    "string.base": `username should be a type of 'text'`,
    "string.empty": `username cannot be an empty field here`,
    "string.min": `username should have a minimum length of 3`,
    "string.max": `username should have a maximum length of 12`,
    "any.required": `username is a required field`,
  }),
  email: Joi.string().email().required().messages({
    "string.email": `email should be a type of 'email'`,
    "string.empty": `email cannot be an empty field here`,
    "any.required": `email is a required field`,
  }),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": `phone should be a type of 'number'`,
      "string.empty": `phone cannot be an empty field here`,
      "string.length": `phone should have a minimum length of 3`,
      "any.required": `phone is a required field`,
    }),
  password: Joi.string().min(8).max(16).required().messages({
    "string.pattern.base": `password should be a type of 'number'`,
    "string.empty": `password cannot be an empty field here`,
    "string.min": `password should have a minimum length of 8`,
    "string.max": `password should have a maximum length of 16`,
    "any.required": `password is a required field`,
  }),
});

const validateSignup = validator(signupSchema);

module.exports = { validateSignup };
