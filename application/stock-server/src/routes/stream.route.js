import express from "express";
import { initializeStreaming } from "../services/initialize.js";

const router = express.Router();

router.get("/start-stream", async (req, res) => {
  try {
    await initializeStreaming();
    res.json({ success: true, message: "Streaming started!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to start streaming." });
  }
});

export default router;
