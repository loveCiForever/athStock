// ./server/src/controller/auth.controller.js

import {
  genUserName,
  hashPassword,
  comparePassword,
  genCookieToken,
} from "../utils/helper-function.utils.js";

import {
  signInValidation,
  signUpValidation,
  oauthValidation,
} from "../services/auth.service.js";

import Users from "../models/user.model.js";
import "dotenv/config";

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    /*
     * Read the general structure of error response at ./server/src/services/auth.service.js
     */
    const { error } = signUpValidation.validate({
      fullName,
      email,
      password,
    });

    if (error) {
      if (error.details[0].path[0] == "fullName") {
        return res.status(400).json({
          message: "Invalid name",
          error: "The fullname's length must be at least 5 characters long",
        });
      } else if (error.details[0].path[0] == "password") {
        return res.status(400).json({
          message: "Invalid password",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "email") {
        return res.status(400).json({
          message: "Invalid email",
          error: "The email must follow the example format: abcde@example.com",
        });
      }
    }

    const isEmailNotUnique = await Users.exists({
      "personal_info.email": email,
    });

    if (isEmailNotUnique) {
      return res.status(400).json({
        message: "Email is already taken",
      });
    }

    const [hashedPassword, userName] = await Promise.all([
      hashPassword(password),
      genUserName(email),
    ]);

    const user = await Users({
      personal_info: {
        fullName,
        userName,
        email,
        password: hashedPassword,
      },
    }).save();

    const access_token = genCookieToken(user._id, res);
    console.log(`[AUTH.CONTROLLER] access_token: ${access_token}`);

    const userToSend = {
      fullName: user.personal_info.fullName,
      userName: user.personal_info.userName,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
      access_token,
    };

    res.status(202).json({
      message: "Registration successfully",
      user: userToSend,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /*
     * Read the general structure of error response at ./server/src/services/auth.service.js
     */
    const { error } = signInValidation.validate({ email, password });

    if (error) {
      if (error.details[0].path[0] == "password") {
        return res.status(400).json({
          message: "Invalid password",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "email") {
        return res.status(400).json({
          message: "Invalid email",
          error: "The email must follow the example format: abcde@example.com",
        });
      }
    }

    const user = await Users.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const isPasswordMatch = await comparePassword(
      password,
      user.personal_info.password
    );

    if (!isPasswordMatch) {
      return res.status(403).json({
        message: "Incorrect password",
      });
    }

    const access_token = genCookieToken(user._id, res);
    console.log(`[AUTH.CONTROLLER] access_token: ${access_token}`);

    const userToSend = {
      fullName: user.personal_info.fullName,
      userName: user.personal_info.userName,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
      access_token,
    };

    res.status(200).json({
      message: "Sign in successful",
      user: userToSend,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("blogToken");

    res.status(200).json({
      message: "Sign out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const oauth = async (req, res) => {
  try {
    const { fullName, email, profile_img } = req.body;
    const { error } = oauthValidation.validate({
      fullName,
      email,
      profile_img,
    });

    if (error)
      return res.formatter.badRequest({
        message: "Oauth validation error",
        error: error,
      });

    const isUserExists = await Users.findOne({ "personal_info.email": email });
    if (!isUserExists) {
      const userName = await genUserName(email);
      const user = await Users({
        personal_info: {
          fullName,
          email,
          profile_img: profile_img,
          userName,
        },
        google_auth: true,
      }).save();
      const userToSend = {
        userName: user.personal_info.userName,
        email: user.personal_info.email,
        profile_img: user.personal_info.profile_img,
      };

      genCookieToken(user._id, res);
      return res.status(201).json(userToSend);
    } else if (isUserExists) {
      const userToSend = {
        userName: isUserExists.personal_info.userName,
        email: isUserExists.personal_info.email,
        profile_img: isUserExists.personal_info.profile_img,
      };
      genCookieToken(isUserExists._id, res);
      return res.status(201).json(userToSend);
    }

    res.status(404).json({ message: "Something went wrong" });
  } catch (error) {
    console.log("Error: on oauth => ", error.message);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export { signup, signin, signout, oauth };
