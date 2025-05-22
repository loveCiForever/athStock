// auth.route.js

import express from "express";
import {
  login,
  logout,
  register,
  verifyAccount,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
const router = new express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyAccount);
router.get("/logout", verifyJWT, logout);

export default router;
