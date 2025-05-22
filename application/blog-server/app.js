import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { responseEnhancer } from "express-response-formatter";

import ConnectDatabase from "./src/configs/database.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";

import authRoute from "./src/routes/auth.route.js";
import blogRoute from "./src/routes/blog.route.js";

const app = express();
const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(responseEnhancer());

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, async () => {
  ConnectDatabase();
  console.log(`[APP.js] Server is running on port ${port}`);
});
