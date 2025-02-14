// auth.controller.js

import {
  genUserName,
  hashPassword,
  comparePassword,
  genCookieToken,
} from "../utils/function.util.js";

import {
  signInValidation,
  signUpValidation,
} from "../services/auth.service.js";

import Users from "../models/user.model.js";

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const { error } = signUpValidation.validate({ fullName, email, password });

    if (error) {
      //   return res.formatter.badRequest(error);
      //   return res.status(400).json({ message: error.details[0].message });
      return res.formatter.badRequest({
        statusCode: error.statusCode,
        message: error.details[0].message,
        user: null,
      });
    }

    const isEmailNotUnique = await Users.exists({
      "personal_info.email": email,
    });

    if (isEmailNotUnique) {
      //   return res.status(400).json({ message: "Email is already taken" });
      return res.formatter.badRequest({
        statusCode: 400,
        message: "Email is already taken",
        user: null,
      });
    }

    const [hashedPassword, userName] = await Promise.all([
      hashPassword(password),
      genUserName(email),
    ]);

    // console.log("=======> Username generated: ", userName);

    const user = await Users({
      personal_info: {
        fullName,
        userName,
        email,
        password: hashedPassword,
      },
    }).save();

    const userToSend = {
      userName: user.personal_info.userName,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
    };
    genCookieToken(user._id, res);
    // res.status(201).json(userToSend);
    res.formatter.accepted({
      statusCode: 202,
      message: "User created successfully",
      user: userToSend,
    });
  } catch (error) {
    console.log("Error: ", error);
    // res
    //   .status(error.status || 500)
    //   .json({ message: error.message || "Interal server error" });
    res.formatter.serverError({
      statusCode: 500,
      message: "Internal server error",
      user: null,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = signInValidation.validate({ email, password });

    if (error) {
      //   return res.status(400).json({ message: error.details[0].message });
      return res.formatter.badRequest({
        statusCode: error.statusCode,
        message: error.details[0].message,
        user: null,
      });
    }

    const user = await Users.findOne({ "personal_info.email": email });
    if (!user) {
      //   return res.status(404).json({ message: "Incorrect email address" });
      return res.formatter.notFound({
        statusCode: 404,
        message: "Incorrect email address",
        user: null,
      });
    }

    const isMatch = await comparePassword(
      password,
      user.personal_info.password
    );

    if (!isMatch) {
      //   return res.status(403).json({ message: "Incorrect password" });
      return res.formatter.forbidden({
        statusCode: 403,
        message: "Incorrect password",
        user: null,
      });
    }

    const userToSend = {
      userName: user.personal_info.userName,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
    };
    genCookieToken(user._id, res);
    // res.status(200).json(userToSend);
    res.formatter.accepted({
      statusCode: 200,
      message: "Sign in successful",
      user: userToSend,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    // res
    //   .status(error.status || 500)
    //   .json({ message: error.message || "Internal server error" });
    res.formatter.internalServerError({
      statusCode: 500,
      message: error.message,
      user: null,
    });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("blogToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error: on singout => ", error.message);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export { signup, signin, signout };
