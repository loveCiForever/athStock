// utils.js

import { nanoid } from "nanoid";
import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

/*
  This function is used to create a username. 
  Summary: 
    Because at the RegisterForm, we just ask the user to provide Fullname, Email, and Password. 
    So that we need to create a function to generate a username.
    The user can update their username after they log in.
    This function will create a username by taking the string before the @ symbol. 
    If that username is not unique, it adds a random string to the end.
  Example: 
    email: quanghuy@gmail.com -> username: quanghuy (Unique)
    email: nhatan123@gmail.com -> username: nhatan123 (Not unique) -> nhatan123-odhq
*/
const genUserName = async (email) => {
  try {
    let username = email.split("@")[0];
    const isUsernameNotUnique = await Users.findOne({
      personal_info: username,
    });

    if (isUsernameNotUnique) {
      username = username + "-" + nanoid().substring(0, 4);
    }

    return username;
  } catch (error) {
    console.log("ERROR ---> usernameGenerator ", error);
  }
};

/*
  This function is used to hash a password for security.
  Summary: 
    This function uses bcrypt to generate a salt and hash the password.
  Example: 
    const hashedPassword = await hashPassword("mySecurePassword123");
*/
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.log("ERROR ---> passwordHashing", error);
  }
};

/*
  This function is used to compare a password with an encrypted password.
  Summary: 
    This function uses bcrypt to check if the plain text password matches the hashed password.
  Example: 
    const isMatch = await comparePassword("mySecurePassword123", hashedPassword);
*/
const comparePassword = async (password, encryptedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    return isMatch;
  } catch (error) {
    console.log("ERROR ---> comparePassword", error);
  }
};

/*
  This function is used to create a cookie token.
  Summary: 
    This function generates a JWT token for the user and sets it as a cookie in the response.
    The token includes the user's ID and is configured with security options.
  Example: 
    await genCookieToken(userId, res);
*/
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
const genCookieToken = async (id, response) => {
  const token = jwt.sign({ id }, JWT_SECRET_TOKEN, { expiresIn: "30d" });
  response.cookie("blogToken", token, {
    httpOnly: true,
    secure: process.env.STATUS !== "dev",
    sameSite: "strict",
    maxAge: 21 * 24 * 60 * 60 * 1000,
  });
};

export { genUserName, hashPassword, comparePassword, genCookieToken };
