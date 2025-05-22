// auth.service.js

import Joi from "joi";
import { passwordRegex } from "../utils/regex.util.js";

/**
 * Validation schema for user registration.
 *
 * Validates the following fields:
 * - full_name: must be at least 5 characters (trimmed) and is required.
 * - email: must be a valid email format (trimmed) and is required.
 * - password: must match the passwordRegex (8–30 chars, upper+lower case, a digit, and a special character) and is required.
 *
 * @type {Joi.ObjectSchema}
 */
const registerValidation = Joi.object({
  full_name: Joi.string().trim().min(5).required().messages({
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 5 characters long.",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required.",
    "string.pattern.base":
      "Password must be 8–30 characters, include upper & lower case letters, a digit, and a special character.",
  }),
});

/**
 * Validation schema for user sign‐in.
 *
 * - email: must be a valid email format and is required.
 * - password: must match the passwordRegex and is required.
 *
 * @type {Joi.ObjectSchema}
 */
const loginValidation = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required.",
    "string.pattern.base":
      "Password must be 8–30 characters, include upper & lower case letters, a digit, and a special character.",
  }),
});

export { registerValidation, loginValidation };
