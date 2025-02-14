// utils.js

import { nanoid } from "nanoid";
import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

/*
    This function is used to create username.

    Summary:
        Because at the RegisterForm, we just ask user to provide Fullname, Email and Password. 
        So that we need to create a function to generate username.
        But the user can update their username after they Logged In.
        This function will create username by taking the string before the @ symbol. 
        If that username is not unique, adding a random string to the end.

    For example: 
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
    This function is used to hashing password for security.

    Summary:

    For example:
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
    This function is used to compare password and encryptedPassword

    Summary:

    For example:
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
    This function used to create cookies Token

    Summary:

    For example:
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
