// ./server/src/controller/blog.controller.js

import { nanoid } from "nanoid";
import BlogModel from "../models/blog.model.js";
import UserModel from "../models/user.model.js";
import { blogValidation } from "../services/blog.service.js";
import mongoose from "mongoose";

const createBlog = async (req, res) => {
  try {
    const currentUserId = req.user;
    console.log(currentUserId);

    if (!currentUserId) {
      return res.status(403).json({ error: "User  not found" });
    }

    let { title, intro, content, tags, category, banner } = req.body;
    const { error } = blogValidation.validate({ title, intro, content });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Wrong format",
        error: error,
      });
    }

    const blogId =
      title.replace(/[^a-zA-z0-9]/g, " ").replace(/\s+/g, "-") + nanoid();

    const newBlog = await BlogModel({
      blog_id: blogId,
      intro,
      title,
      content,
      tags,
      category,
      author: currentUserId,
      banner,
    }).save();

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: currentUserId },
      {
        $inc: { "account_info.total_posts": 1 },
        $push: { blogs: newBlog._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog has been published successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("[CREATE BLOG] ", error);
    return res.status(500).json({
      success: false,
      message: "Publish failed",
      error: error,
    });
  }
};

const fetchLatestBlog = async (req, res) => {
  try {
    let { page } = req.body;
    let maxLimit = 10;

    BlogModel.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.user_name personal_info.full_name -_id"
      )
      .sort({ publishedAt: -1 })

      .select(
        "blog_id title intro category activity tags publishedAt -_id banner author"
      )
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .then((blogs) => {
        return res.status(200).json({
          success: true,
          message: "Fetch latest blog successfully",
          data: blogs,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Fetch latest blog failed",
          error: error,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch latest blog failed",
      error: error,
    });
  }
};

const fetchBlogByCategory = async (req, res) => {
  try {
    let { page, category } = req.body;
    let maxLimit = 10;

    BlogModel.find({ draft: false })
      .find({ category: category })
      .populate(
        "author",
        "personal_info.profile_img personal_info.userName personal_info.fullName -_id"
      )
      .sort({ publishedAt: -1 })

      .select(
        "blog_id title intro category activity tags publishedAt -_id banner"
      )
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .then((blogs) => {
        return res.status(200).json({ blogs });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.error("Error: latest blog ---->", error);
    return res.status(500).json({
      message: "Latest blog error",
      error: error.message,
    });
  }
};

const fetchBlogById = async (req, res) => {
  try {
    let { blog_id } = req.body;

    BlogModel.find({ draft: false })
      .find({ blog_id: blog_id })
      .populate(
        "author",
        "personal_info.profile_img personal_info.user_name personal_info.full_name -_id"
      )
      .select(
        "blog_id title intro banner content tags category activity comments publishedAt -_id "
      )
      .then((blog) => {
        return res.status(200).json({ blog });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.error("Error: latest blog ---->", error);
    return res.status(500).json({
      message: "Latest blog error",
      error: error.message,
    });
  }
};

const likeByBlogId = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const userId = req.user._id;
      const { blog_id } = req.body;

      // Load the blog, user document *in the transaction*
      const [blog, user] = await Promise.all([
        BlogModel.findOne({ blog_id }).session(session),
        UserModel.findById(userId).session(session),
      ]);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
          error: "Look at message :D",
        });
      }

      // Already liked?
      if (blog.activity.likesBy.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "Already upvoted",
          error: "Look at message :D",
        });
      }

      // If previously disliked, remove that
      if (blog.activity.dislikesBy.includes(userId)) {
        blog.activity.dislikesBy.pull(userId);
        blog.activity.total_dislikes--;
      }

      if (user.activities.dislike.includes(blog._id)) {
        user.activities.dislike.pull(blog._id);
      }

      // Add the like
      blog.activity.likesBy.push(userId);
      blog.activity.total_likes++;

      user.activities.like.push(blog._id);

      // Save *inside* the transaction
      await blog.save({ session });
      res.json({ success: true, message: "Upvote successfully", data: blog });
    });
  } catch (err) {
    console.error("[likeByBlogId] transaction error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: "Hehehe you are getting some trouble with your backend code",
      });
    }
  } finally {
    session.endSession();
  }
};

export default likeByBlogId;

const getVoteStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { blog_id } = req.params;

    const blog = await BlogModel.findOne(
      { blog_id },
      "activity.likesBy activity.dislikesBy"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const liked = blog.activity.likesBy.includes(userId);
    const disliked = blog.activity.dislikesBy.includes(userId);

    return res.json({ liked, disliked });
  } catch (err) {
    console.error("Error fetching vote status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const dislikeByBlogId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { blog_id } = req.body;

    const blog = await BlogModel.findOne({ blog_id });
    if (!blog) return res.status(404).json({ message: "Not found" });

    if (blog.activity.dislikesBy.includes(userId)) {
      return res.status(400).json({ message: "Already downvoted" });
    }
    const wasLike = blog.activity.likesBy.indexOf(userId);
    if (wasLike !== -1) {
      blog.activity.likesBy.splice(wasLike, 1);
      blog.activity.total_likes--;
    }

    blog.activity.dislikesBy.push(userId);
    blog.activity.total_dislikes++;

    await blog.save();
    res.json({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createBlog,
  fetchLatestBlog,
  fetchBlogByCategory,
  fetchBlogById,
  likeByBlogId,
  dislikeByBlogId,
  getVoteStatus,
};
