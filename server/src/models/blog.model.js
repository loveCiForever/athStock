// ./server/src/models/blog.model.js

import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema(
  {
    blog_id: {
      type: String,
      // required: true,
      unique: true,
    },
    title: {
      type: String,
      // required: true,
    },
    head: {
      type: String,
      maxLength: 300,
    },
    banner: {
      type: String,
    },
    des: {
      type: String,
      maxLength: 200,
    },

    content: {
      type: [],
    },
    tags: {
      type: [String],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "users",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

const blogModel = mongoose.model("blogs", blogSchema) || mongoose.model.blogs;
export default blogModel;
