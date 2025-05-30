import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import client from "ssi-fcdata";

import corsMiddleware from "./src/middelwares/cors.middleware.js";
import { initializeStreaming } from "./src/services/initStreaming.service.js";
import index from "./src/routes/index.route.js";
import ohlc from "./src/routes/ohlc.route.js";
import securites from "./src/routes/securities.route.js";
import stock from "./src/routes/stock.route.js";

initializeStreaming();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(corsMiddleware);

app.use("/ssi", index);
app.use("/ssi", ohlc);
app.use("/ssi", securites);
app.use("/ssi", stock);

app.get("/", (req, res) => {
  res.send("Hehehehehehehe");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
