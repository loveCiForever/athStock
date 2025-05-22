// auth.controller.js

import {
  genUserName,
  hashPassword,
  comparePassword,
} from "../utils/helper.util.js";

import jwt from "jsonwebtoken";
import {
  loginValidation,
  registerValidation,
} from "../services/auth.service.js";

import { genVerificationToken, genCookieToken } from "../utils/token.util.js";
import transporter from "../utils/mail.util.js";
import Users from "../models/user.model.js";
import "dotenv/config";
import userModel from "../models/user.model.js";

const register = async (req, res) => {
  try {
    // console.log("[REGISTER API]");

    const { full_name, email, password, navigateToHome } = req.body;
    // console.log("BODY REQUEST:", JSON.stringify(req.body, null, 2));

    const { error } = registerValidation.validate({
      full_name,
      email,
      password,
    });

    if (error) {
      if (error.details[0].path[0] == "full_name") {
        return res.status(400).json({
          success: false,
          message: "Invalid name",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "password") {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "email") {
        return res.status(400).json({
          success: false,
          message: "Invalid email",
          error: error.details[0].message,
        });
      }
      return;
    }

    const isEmailNotUnique = await Users.exists({
      "personal_info.email": email,
    });

    if (isEmailNotUnique) {
      return res.status(400).json({
        success: false,
        message: "User registration failed",
        error: "Email is already taken",
      });
    }

    const [hashedPassword, user_name] = await Promise.all([
      hashPassword(password),
      genUserName(email),
    ]);

    const user = await Users({
      personal_info: {
        full_name,
        user_name,
        email,
        password: hashedPassword,
      },
    }).save();

    const verifyToken = genVerificationToken(user._id);
    try {
      const verifyUrl = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verifyToken}`;

      await transporter.sendMail({
        from: `"athStock Support" <${process.env.SMTP_USER}>`,
        to: user.personal_info.email,
        subject: "Xác thực tài khoản",
        html: `
          <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="630" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; max-width: 630px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); font-family: Roboto, sans-serif;">
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="color: #333;">Cám ơn ${user.personal_info.full_name} đã đăng ký với <strong>athStock</strong>!</h2>
                      <p style="font-size: 16px; color: #555;">Vui lòng xác thực địa chỉ email của bạn bằng cách nhấn nút bên dưới:</p>

                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyUrl}"
                          style="background-color: #000000; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                          Xác thực Email
                        </a>
                      </div>

                      <p style="font-size: 16px; color: #555;">Nếu nút xác thực bị lỗi, bạn hãy truy cập thông qua đường link sau: ${verifyUrl}</p>
                      <p style="font-size: 16px; color: #555;">Tài khoản sẽ tự động bị hủy sau 24h nếu bạn không tiến hành xác thực</p>

                      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

                      <table cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px; color: #444;">
                        <tr><td colspan="2" height="0" style="line-height: 0px;">&nbsp;</td></tr>
                        <tr>
                          <td>
                            <strong style="font-size: 16px; color: #222;">athStock Support Team</strong><br />
                            <a href="mailto:support@athstock.io.vn" style="color: #5a5a5a; text-decoration: none;">support@athstock.io.vn</a><br />
                            <a href="https://athstock.io.vn" target="_blank" style="color: #5a5a5a; text-decoration: none;">www.athstock.io.vn</a><br />
                            <span>Hotline: +84 963040805</span><br />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          `,
      });
    } catch (error) {
      console.error(error);
      await Users.deleteOne({ _id: user._id });
      console.error("[MAIL ERROR] – user was rolled back:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed at email step. Please try again later.",
      });
    }

    const userToSend = {
      full_name: user.personal_info.full_name,
      user_name: user.personal_info.user_name,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
      verify_token: verifyToken,
    };

    res.status(201).json({
      success: true,
      message:
        "Registration successful! A verification email has been sent to your address.",
      data: { user: userToSend },
    });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidation.validate({ email, password });

    if (error) {
      if (error.details[0].path[0] == "password") {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "email") {
        return res.status(400).json({
          success: false,
          message: "Invalid email",
          error: error.details[0].message,
        });
      }
    }

    const user = await Users.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User login in failed",
        error: "Email is not found",
      });
    }

    if (user.is_logged_in) {
      return res.status(409).json({
        success: false,
        message: "User login in failed",
        error: "You account is login in at another place",
      });
    }

    const isPasswordMatch = await comparePassword(
      password,
      user.personal_info.password
    );

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "User sign in failed",
        error: "Password is not correct",
      });
    }

    user.is_logged_in = true;
    await user.save();

    const access_token = genCookieToken(user._id, res);
    const userToSend = {
      full_name: user.personal_info.full_name,
      user_name: user.personal_info.user_name,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
      is_logged_in: user.is_logged_in,
      access_token,
    };

    res.status(200).json({
      success: true,
      message: "User has successfully login in",
      data: { user: userToSend },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

const logout = async (req, res) => {
  const user_id = req.user;
  console.log(user_id);

  try {
    res.clearCookie("blogToken");

    const user = await Users.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User log out failed",
        error: "Email is not found",
      });
    }

    if (!user.is_logged_in) {
      return res.status(404).json({
        success: false,
        message: "User log out failed",
        error: "User has not log in yet",
      });
    }

    user.is_logged_in = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Log out successfully",
    });
  } catch (error) {
    // console.log("Log out error: ", error);
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Missing token",
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
        error: err.message,
      });
    }

    const user = await userModel.findById(payload.sub);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    user.is_verified = true;
    user.verifiedAt = Date.now();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserInfo = async (req, res) => {
  const user_id = req.user;
  try {
    const user = await Users.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Get user information failed",
        error: "Email is not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get user information successfully",
      data: { user: user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

export { register, login, logout, getUserInfo, verifyAccount };
