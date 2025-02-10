// app.js

import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

import ConnectDatabase from "./src/configs/database.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";

import helloworldRoute from "./src/routes/helloworld.route.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

app.use("/api", helloworldRoute);

app.listen(port, () => {
  ConnectDatabase();
  console.log(`Server is running on port ${port}`);
});
