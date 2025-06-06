// application/blog-server/src/controllers/upload.controller.js

import { downloadImage } from "../services/upload.service.js";
import path from "path";

export const uploadByFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        error: "No file uploaded",
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    return res.json({
      success: 1,
      file: {
        url: fileUrl,
        name: req.file.filename,
        size: req.file.size,
        type: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("[UPLOAD_BY_FILE]", error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

export const uploadByUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({
        success: 0,
        error: "URL is required",
      });
    }

    const filepath = await downloadImage(url);
    const filename = path.basename(filepath);
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    return res.json({
      success: 1,
      file: {
        url: fileUrl,
        name: filename,
      },
    });
  } catch (error) {
    console.error("[UPLOAD_BY_URL]", error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};
