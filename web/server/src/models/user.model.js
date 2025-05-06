// ./server/src/models/user.model.js

import { mongoose, Schema } from "mongoose";

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      full_name: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [5, "Fullname's length must be more than 5 characters"],
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },

      password: {
        type: String,
        require: true,
      },

      user_name: {
        type: String,
        minlength: [5, "Username's length must be more than 5 characters"],
        unique: true,
        required: true,
      },

      bio: {
        type: String,
        maxLength: [
          200,
          "Bio's content should not be more than 200 characters",
        ],
        default: "",
      },

      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`;
        },
      },
    },

    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },

    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },

    google_auth: {
      type: Boolean,
      default: false,
    },

    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
    isSignedIn: {
      type: Boolean,
      default: false,
      required: true,
    },
    activities: {
      like: [{ type: mongoose.Schema.Types.ObjectId, ref: "blogs" }],
      dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "blogs" }],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

const userModel = mongoose.model("users", userSchema) || mongoose.model.users;
export default userModel;
