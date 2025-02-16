//  auth.service.js
import Joi from "joi";
import {
  emailRegex,
  passwordRegex,
  fullNameRegex,
} from "../utils/regex.util.js";

/*
  GENERAL STRUCTURE OF THE ERROR RESPONSE ***(Take signUpValidation as an example)***:
  {
    "error": {
      "details": [
        {
          "message": "fullName is not allowed to be empty",
          "path": ["fullName"],
          "type": "any.required",
          "context": {
            "label": "fullName",
            "key": "fullName"
          }
        },
        {
          "message": "Invalid email format",
          "path": ["email"],
          "type": "string.email",
          "context": {
            "label": "email",
            "key": "email"
          }
        },
        {
          "message": "The password must be between 8 and 30 characters long and contain at least 1 number.",
          "path": ["password"],
          "type": "string.pattern.base",
          "context": {
            "label": "password",
            "key": "password"
          }
        }
      ]
    }
  }
*/
const signUpValidation = Joi.object({
  fullName: Joi.string().pattern(fullNameRegex).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "The password must be between 8 and 30 characters long and contain at least 1 number.",
  }),
});

const signInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "The password must be between 8 and 30 characters long and contain at least 1 number.",
  }),
});

const oauthValidation = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  profile_img: Joi.string().required(),
});

export { signInValidation, signUpValidation, oauthValidation };
