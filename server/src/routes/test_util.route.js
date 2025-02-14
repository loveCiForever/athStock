//  test_util.route.js

import express from "express";
import { test_hash_password } from "../controllers/test_util.controller.js";

const router = new express.Router();

router.post("/test_hash_password", test_hash_password);

export default router;
