// application/blog-server/src/routes/upload.route.js

import express from "express";
import { upload } from "../services/upload.service.js";
import { uploadByFile, uploadByUrl } from "../controllers/upload.controller.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";

const router = express.Router();

router.post("/uploadFile", verifyJWT, upload.single("image"), uploadByFile);
router.post("/uploadUrl", verifyJWT, uploadByUrl);

export default router;
