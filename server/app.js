// app.js

import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { responseEnhancer } from "express-response-formatter";

import ConnectDatabase from "./src/configs/database.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";

import helloworldRoute from "./src/routes/helloworld.route.js";
import test_utilRoute from "./src/routes/test_util.route.js";
import authRoute from "./src/routes/auth.route.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(responseEnhancer());

app.use("/api", helloworldRoute);
app.use("/api", test_utilRoute);
app.use("/api/auth", authRoute);

app.get("/test", (req, res) => {
  res.send("Server is working!");
});

app.listen(port, async () => {
  ConnectDatabase();
  console.log(`Server is running on port ${port}`);
});
