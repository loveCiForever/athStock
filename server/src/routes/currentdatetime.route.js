// currentdatetime.route.js

import express from "express";
import { currentdatetime } from "../controllers/currentdatetime.controller.js";

const router = new express.Router();

router.get("/currentdatetime", currentdatetime);

export default router;
