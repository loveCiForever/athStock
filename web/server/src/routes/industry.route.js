// ./server/src/routes/auth.route.js

import express from "express";
import { fetchAllIndustryList } from "../controllers/industry.controller.js";

const router = new express.Router();

router.post("/industry_list", fetchAllIndustryList);

export default router;
