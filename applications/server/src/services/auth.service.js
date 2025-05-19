// ./server/src/services/auth.service.js

import Joi from "joi";
import {
  emailRegex,
  passwordRegex,
  fullNameRegex,
} from "../utils/regex.util.js";

/**
 * GENERAL STRUCTURE OF THE JOI's RESPONSE (Take signUpValidation as an example):
 *
 * {
 *   "error": {
 *     "details": [
 *       {
 *         "message": "fullName is not allowed to be empty",
 *         "path": ["fullName"],
 *         "type": "any.required",
 *         "context": {
 *           "label": "fullName",
 *           "key": "fullName"
 *         }
 *       },
 *       {
 *         "message": "Invalid email format",
 *         "path": ["email"],
 *         "type": "string.email",
 *         "context": {
 *           "label": "email",
 *           "key": "email"
 *         }
 *       },
 *       {
 *         "message": "The password must be between 8 and 30 characters long and contain at least 1 number.",
 *         "path": ["password"],
 *         "type": "string.pattern.base",
 *         "context": {
 *           "label": "password",
 *           "key": "password"
 *         }
 *       }
 *     ]
 *   }
 * }
 */

/**
 * Validation schema for user sign-up.
 *
 * Validates the following fields:
 * - fullName: Must match the fullName regex and is required.
 * - email: Must be a valid email format and is required.
 * - password: Must match the password regex and is required. Custom error messages are provided for pattern validation.
 *
 * @type {Joi.ObjectSchema}
 */
const signUpValidation = Joi.object({
  full_name: Joi.string().required().min(5),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "The password must be between 8 and 30 characters long and contain at least 1 number.",
  }),
});

/**
 * Validation schema for user sign-in.
 *
 * Validates the following fields:
 * - email: Must be a valid email format and is required.
 * - password: Must match the password regex and is required. Custom error messages are provided for pattern validation.
 *
 * @type {Joi.ObjectSchema}
 */
const signInValidation = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "The password must be between 8 and 30 characters long and contain at least 1 number.",
  }),
});

/**
 * Validation schema for OAuth user data.
 *
 * Validates the following fields:
 * - fullName: Required string.
 * - email: Must be a valid email format and is required.
 * - profile_img: Required string for the profile image URL.
 *
 * @type {Joi.ObjectSchema}
 */
const oauthValidation = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  profile_img: Joi.string().required(),
});

export { signInValidation, signUpValidation, oauthValidation };
