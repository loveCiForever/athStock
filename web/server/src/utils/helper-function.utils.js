// ./server/src/utils/helper-function.utils.js

import { nanoid } from "nanoid";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Generates a unique username from the provided email.
 * If the username is not unique, appends a random string.
 *
 * @param {string} email - The user's email address.
 * @returns {Promise<string>} - A unique username.
 * @throws {Error} - Throws an error if the database query fails.
 *
 * @example
 * const username = await genUser Name("quanghuy@gmail.com");
 */
const genUserName = async (email) => {
  // Split email to get the username
  try {
    let user_name = email.split("@")[0];
    const isUserNameNotUnique = await UserModel.findOne({
      personal_info: user_name,
    });

    // If username is not unique, append a random string
    if (isUserNameNotUnique) {
      user_name = user_name + "-" + nanoid().substring(0, 4);
    }

    return user_name;
  } catch (error) {
    console.log("[GEN USERNAME] ", error);
    throw error; // Rethrow the error for handling upstream
  }
};

/**
 * Hashes a password using bcrypt for security.
 *
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - Throws an error if hashing fails.
 *
 * @example
 * const hashedPassword = await hashPassword("mySecurePassword123");
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.log("HASH PASSWORD: ", error);
    throw error; // Rethrow the error for handling upstream
  }
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} password - The plain text password.
 * @param {string} encryptedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 * @throws {Error} - Throws an error if comparison fails.
 *
 * @example
 * const isMatch = await comparePassword("mySecurePassword123", hashedPassword);
 */
const comparePassword = async (password, encryptedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    return isMatch;
  } catch (error) {
    console.log("COMPARED PASSWORD: ", error);
    throw error; // Rethrow the error for handling upstream
  }
};

/**
 * Generates a JWT token and sets it as a cookie in the response.
 *
 * @param {string} id - The user's ID.
 * @param {Object} response - The HTTP response object.
 * @returns {void}
 *
 * @example
 * await genCookieToken(userId, res);
 */
const genCookieToken = (id, response) => {
  const token = jwt.sign({ id }, process.env.SECRET_ACCESS_KEY, {
    expiresIn: "30d",
  });
  response.cookie("athStockToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export { genUserName, hashPassword, comparePassword, genCookieToken };
