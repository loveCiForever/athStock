// ./server/src/controller/blog.controller.js

import { nanoid } from "nanoid";
import BlogModel from "../models/blog.model.js";
import UserModel from "../models/user.model.js";
import { blogValidation } from "../services/blog.service.js";
import mongoose from "mongoose";

const createBlog = async (req, res) => {
  try {
    const currentUserId = req.user;
    console.log(`[CREATE BLOG] userID: ${currentUserId}`);

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
    }).save();

    await UserModel.findOneAndUpdate(
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
        "blog_id title intro banner content tags category activity comments publishedAt -_id "
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

const fetchBlogsByAuthorId = async (req, res) => {
  try {
    const { author_id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const blogs = await BlogModel.find({
      author: author_id,
      draft: false,
    })
      .populate(
        "author",
        "personal_info.profile_img personal_info.user_name personal_info.full_name -_id"
      )
      .sort({ publishedAt: -1 })
      .select(
        "blog_id title intro images content tags category activity comments publishedAt -_id"
      )
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await BlogModel.countDocuments({
      author: author_id,
      draft: false,
    });

    return res.status(200).json({
      success: true,
      message: "Fetch author's blogs successfully",
      data: {
        blogs,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    });
  } catch (error) {
    console.error("[FETCH_AUTHOR_BLOGS] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch author's blogs",
      error: error.message,
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
        "personal_info.profile_img personal_info.user_name personal_info.full_name -_id"
      )
      .sort({ publishedAt: -1 })

      .select(
        "blog_id title intro banner content tags category activity comments publishedAt -_id "
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
      success: false,
      message: "Latest blog error",
      error: error.message,
    });
  }
};

const getVoteStatusByBlogIdUserId = async (req, res) => {
  const { blog_id } = req.body;
  const user_id = req.user;

  try {
    const blog = await BlogModel.findOne({ blog_id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Get vote status failed",
        error: "Blog id not found",
      });
    }

    const blogObjId = blog._id;

    const user = await UserModel.findById(user_id).select(
      "activities.like activities.dislike"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Get vote status failed",
        error: "User not found",
      });
    }

    const hasLiked = user.activities.like.some((id) => id.equals(blogObjId));
    const hasDisliked = user.activities.dislike.some((id) =>
      id.equals(blogObjId)
    );

    return res.status(200).json({
      success: true,
      message: "Get vote status successfully",
      data: {
        user_id,
        blog_id: blog.blog_id,
        hasLiked,
        hasDisliked,
      },
    });
  } catch (error) {
    console.error("[getVoteStatus] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vote status",
      error: error.message,
    });
  }
};

const likeByBlogId = async (req, res) => {
  try {
    const userId = req.user;
    const { blog_id } = req.body;

    const blog = await BlogModel.findOne({ blog_id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        error: "Look at message :D",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Look at message :D",
      });
    }

    if (blog.activity.likesBy.some((id) => id.equals(user._id))) {
      return res.status(400).json({
        success: false,
        message: "Already upvoted",
        error: "Look at message :D",
      });
    }

    const blogObjId = blog._id;
    const userObjId = user._id;

    if (blog.activity.dislikesBy.some((id) => id.equals(userObjId))) {
      blog.activity.dislikesBy.pull(userObjId);
      blog.activity.total_dislikes--;
      user.activities.dislike.pull(blogObjId);
    }

    blog.activity.likesBy.push(userObjId);
    blog.activity.total_likes++;
    user.activities.like.push(blogObjId);

    await blog.save();
    await user.save();

    return res.json({
      success: true,
      message: "Upvote successfully",
      data: { blog, user },
    });
  } catch (err) {
    console.error("[likeByBlogId] error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const unVote = async (req, res) => {
  const userId = req.user;
  const { blog_id } = req.body;

  try {
    const blog = await BlogModel.findOne({ blog_id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        error: "Look at message :D",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Look at message :D",
      });
    }

    const blogObjId = blog._id;
    const userObjId = user._id;

    if (blog.activity.dislikesBy.some((id) => id.equals(userObjId))) {
      blog.activity.dislikesBy.pull(userObjId);
      blog.activity.total_dislikes--;
      user.activities.dislike.pull(blogObjId);
    }

    if (blog.activity.likesBy.some((id) => id.equals(userObjId))) {
      blog.activity.likesBy.pull(userObjId);
      blog.activity.total_likes--;
      user.activities.like.pull(blogObjId);
    }

    await user.save();
    await blog.save();

    return res.json({
      success: true,
      message: "Unvote successfully",
      data: { blog, user },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "hehehe unvote failed", error: error });
  }
};

const dislikeByBlogId = async (req, res) => {
  try {
    const userId = req.user;
    const { blog_id } = req.body;

    const blog = await BlogModel.findOne({ blog_id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        error: "Look at message :D",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Look at message :D",
      });
    }

    if (blog.activity.dislikesBy.some((id) => id.equals(user._id))) {
      return res.status(400).json({
        success: false,
        message: "Already downvoted",
        error: "Look at message :D",
      });
    }

    const blogObjId = blog._id;
    const userObjId = user._id;

    if (blog.activity.likesBy.some((id) => id.equals(userObjId))) {
      blog.activity.likesBy.pull(userObjId);
      blog.activity.total_likes--;
      user.activities.like.pull(blogObjId);
    }

    blog.activity.dislikesBy.push(userObjId);
    blog.activity.total_dislikes++;
    user.activities.dislike.push(blogObjId);

    await blog.save();
    await user.save();

    return res.json({
      success: true,
      message: "Downvote successfully",
      data: { blog, user },
    });
  } catch (err) {
    console.error("[dislikeByBlogId] error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export {
  createBlog,
  fetchLatestBlog,
  fetchBlogByCategory,
  fetchBlogById,
  likeByBlogId,
  dislikeByBlogId,
  getVoteStatusByBlogIdUserId,
  unVote,
  fetchBlogsByAuthorId,
};
