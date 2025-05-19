// ./server/src/models/comment.model.js

import mongoose, { Schema } from "mongoose";

const industrySchema = mongoose.Schema(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    icb_name: {
        type: String,
        required: true
    },
    en_icb_name: {
        type: String,
        required: true
    },
    icb_code: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
  },
);
const industryModel =
  mongoose.model("industries", industrySchema) || mongoose.model.industries;
export default industryModel;
