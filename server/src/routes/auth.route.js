// ./server/src/routes/auth.route.js

import express from "express";
import {
  signin,
  signout,
  signup,
  oauth,
} from "../controllers/auth.controller.js";

const router = new express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/oauth", oauth);

export default router;
