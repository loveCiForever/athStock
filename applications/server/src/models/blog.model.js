// ./server/src/models/blog.model.js

import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema(
  {
    blog_id: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      maxLength: 150,
    },
    intro: {
      type: String,
      maxLength: 500,
    },
    banner: {
      type: String,
    },
    content: {
      type: [],
    },
    tags: {
      type: [String],
    },
    category: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_dislikes: {
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
      likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
      dislikesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
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
