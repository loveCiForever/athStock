// ./server/src/controller/blog.controller.js

import { nanoid } from "nanoid";
import BlogModel from "../models/blog.model.js";
import UserModel from "../models/user.model.js";
import { blogValidation } from "../services/blog.service.js";
import blogModel from "../models/blog.model.js";

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
      return res.formatter.badRequest({
        statusCode: 400,
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

    console.log("Updated User:", updatedUser);

    return res.formatter.accepted({
      statusCode: 200,
      message: "Blog published",
    });
  } catch (error) {
    console.error("Error: create blog ----> ", error);
    return res.status(500).json({
      message: "Create blog error",
      error: error.message,
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
        "personal_info.profile_img personal_info.userName personal_info.fullName -_id"
      )
      .select(
        "blog_id title intro banner content tags category activity comments publishedAt -_id "
      )
      .then((blog) => {
        // console.log(blog);
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
  try {
    let { blog_id } = req.body;

    const updatedBlog = await BlogModel.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_likes": 1 } },
      { new: true }
    );

    return res.status(200).json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error: latest blog ---->", error);
    return res.status(500).json({
      message: "Latest blog error",
      error: error.message,
    });
  }
};

const dislikeByBlogId = async (req, res) => {
  try {
    let { blog_id } = req.body;

    const updatedBlog = await BlogModel.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_dislikes": 1 } },
      { new: true }
    );

    return res.status(200).json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error: latest blog ---->", error);
    return res.status(500).json({
      message: "Latest blog error",
      error: error.message,
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
};
