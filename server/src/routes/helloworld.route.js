//  helloworld.route.js

import express from "express";
import { helloworld } from "../controllers/helloworld.controller.js";

const router = new express.Router();

router.get("/helloworld", helloworld);

export default router;
