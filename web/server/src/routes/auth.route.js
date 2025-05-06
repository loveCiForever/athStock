// ./server/src/routes/auth.route.js

import express from "express";
import {
  signin,
  signout,
  signup,
  oauth,
  getUserInfo,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
const router = new express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", verifyJWT, signout);
router.post("/oauth", oauth);
router.post("/get-user-info", verifyJWT, getUserInfo);

export default router;
