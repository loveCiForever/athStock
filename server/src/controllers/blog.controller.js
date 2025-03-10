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

    let { title, head, content, tags } = req.body;
    const { error } = blogValidation.validate({ title, head, content });

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
      head,
      title,
      content,
      tags,
      author: currentUser,
    }).save();

    // console.log("NEW BLOG: ", newBlog);

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
    console.log("Error: on create blog ----> ", error);
    return res.formatter.serverError({
      statusCode: 500,
      error: error.message,
    });
  }
};

export { createBlog };
