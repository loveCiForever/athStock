// auth.route.js

import express from "express";
import { getUserInfo, updateBio } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
const router = new express.Router();

router.get("/get-user-info", verifyJWT, getUserInfo);
router.patch("/update-bio", verifyJWT, updateBio);

export default router;
