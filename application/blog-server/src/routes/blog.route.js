// ./server/src/routes/blog.route.js

import express from "express";
import { createBlog } from "../controllers/blog.controller.js";
import { fetchLatestBlog } from "../controllers/blog.controller.js";
import { fetchBlogByCategory } from "../controllers/blog.controller.js";
import { fetchBlogById } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { likeByBlogId } from "../controllers/blog.controller.js";
import {
  dislikeByBlogId,
  fetchBlogsByAuthorId,
  searchBlogsByTag,
} from "../controllers/blog.controller.js";

import { getVoteStatusByBlogIdUserId } from "../controllers/blog.controller.js";
import { unVote, searchBlogs } from "../controllers/blog.controller.js";
const router = new express.Router();

router.post("/create-blog", verifyJWT, createBlog);
router.post("/latest-blog", fetchLatestBlog);
router.get("/author/:author_id", verifyJWT, fetchBlogsByAuthorId);
router.post("/category", fetchBlogByCategory);
router.post("/get-blog-by-id", fetchBlogById);
router.post("/like-blog-by-id", verifyJWT, likeByBlogId);
router.post("/dislike-blog-by-id", verifyJWT, dislikeByBlogId);
router.post("/search", searchBlogs);
router.post("/search-by-tag", searchBlogsByTag);
router.post("/vote-status", verifyJWT, getVoteStatusByBlogIdUserId);
router.post("/unvote", verifyJWT, unVote);

export default router;
