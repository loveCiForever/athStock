// app.js

import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server as IOServer } from "socket.io";
import client from "ssi-fcdata";
import chalk from "chalk";
import corsMiddleware from "./src/middelwares/cors.middleware.js";
import {
  initializeRestApi,
  initializeStreaming,
} from "./src/services/initialize.service.js";
import index from "./src/routes/index.route.js";
import ohlc from "./src/routes/ohlc.route.js";
import securites from "./src/routes/securities.route.js";
import stock from "./src/routes/stock.route.js";
import { logger } from "./src/services/helper.service.js";

initializeRestApi();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(corsMiddleware);

app.use("/ssi", index);
app.use("/ssi", ohlc);
app.use("/ssi", securites);
app.use("/ssi", stock);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializeStreaming(io);
io.on("connection", (socket) => {
  logger.success(`[socketIO] connected to socket.id=${socket.id}`);

  socket.on("switchChannel", (channelName) => {
    console.log("[Socket.IO] Client requested switchChannel:", channelName);
    client.switchChannel(channelName);
  });

  client.bind(client.events.onData, (message) => {
    // logger.data(`[socketIO] raw message: ${message}`);
    try {
      const outerData =
        typeof message === "string" ? JSON.parse(message) : message;
      const stockData = JSON.parse(outerData.Content);

      // logger.data(`[socketIO] Parsed data \n ${stockData}`);
      socket.emit("stockData", stockData);
    } catch (err) {
      logger.error(`[socketIO] Failed to parse message: ${err}`);
    }
  });

  socket.on("disconnect", () => {
    logger.warning(`[socketIO] disconnected from socket.id = ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  logger.info(`[rest-api] rest API server is running on port ${PORT}`);
  logger.info(`[socketIO] socket listening on port ${PORT}`);
});
