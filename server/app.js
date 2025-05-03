// app.js

import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { responseEnhancer } from "express-response-formatter";

import ConnectDatabase from "./src/configs/database.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";

import helloworldRoute from "./src/routes/helloworld.route.js";
import authRoute from "./src/routes/auth.route.js";
import blogRoute from "./src/routes/blog.route.js";
import industryRoute from "./src/routes/industry.route.js";

import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(responseEnhancer());

app.use("/api", helloworldRoute);
app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/stock", industryRoute);

app.listen(port, async () => {
  ConnectDatabase();
  console.log(`[APP.js] Server is running on port ${port}`);
});
