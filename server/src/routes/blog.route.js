// ./server/src/routes/blog.route.js

import express from "express";
import { createBlog } from "../controllers/blog.controller.js";
import { latestBlog } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
const router = new express.Router();

router.post("/create-blog", verifyJWT, createBlog);
router.post("/latest-blog", latestBlog);

export default router;
