//  auth.service.js
import Joi from "joi";
import {
  emailRegex,
  passwordRegex,
  fullNameRegex,
} from "../utils/regex.util.js";

/*
    This function is used to validate the user's input data when signing up.

         
    Summary:

    For example:
*/
const signUpValidation = Joi.object({
  fullName: Joi.string().pattern(fullNameRegex).required(),
  // email: Joi.string().pattern(emailRegex).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "The password must be between 8 and 30 characters long and contain at least 1 number.",
  }),
});

/*
    This function is used to validate the user's input data when signing in.
     
    Summary:

    For example:
*/

const signInValidation = Joi.object({
  // email: Joi.string().pattern(emailRegex).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "The password must be between 8 and 30 characters long and contain at least 1 number.",
  }),
});

export { signInValidation, signUpValidation };
