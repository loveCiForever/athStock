// ./server/src/controller/blog.controller.js

import { nanoid } from "nanoid";
import BlogModel from "../models/blog.model.js";
import UserModel from "../models/user.model.js";
import { blogValidation } from "../services/blog.service.js";

const createBlog = async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(403).json({ error: "User  not found" });
    }

    let { title, intro, content, tags, category } = req.body;
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

    console.log("blog id:", blogId);
    const newBlog = await BlogModel({
      blog_id: blogId,
      intro,
      title,
      content,
      tags,
      category,
      author: currentUser,
    }).save();

    await UserModel.findOneAndUpdate(
      { _id: currentUser.id },
      {
        $inc: { "account_info.total_posts": 1 },
        $push: { blogs: newBlog._id },
      }
    );

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

const latestBlog = async (req, res) => {
  try {
    let { page } = req.body;
    let maxLimit = 5;

    BlogModel.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.userName personal_info.fullName -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title intro category activity tags publishedAt -_id")
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

export { createBlog, latestBlog };
