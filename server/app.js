import "dotenv/config";
import express from "express";

import ConnectDatabase from "./src/configs/database.js";
import corsMiddleware from "./src/middlewares/cors.middlewares.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(corsMiddleware);

app.listen(port, () => {
  ConnectDatabase();
  console.log(`Server is running on port ${port}`);
});
