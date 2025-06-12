// ./application/stock-server/src/services/initialize.js

import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";
import { logger } from "./helper.service.js";

export async function initializeStreaming(io) {
  const cfg = ssiConfig();

  try {
    const response = await axios.post(
      cfg.market.ApiUrl + client.api.GET_ACCESS_TOKEN,
      {
        consumerID: cfg.market.ConsumerId,
        consumerSecret: cfg.market.ConsumerSecret,
      }
    );

    if (response.data.status === 200 && response.data.data?.accessToken) {
      const token = "Bearer " + response.data.data.accessToken;

      client.initStream({ url: cfg.market.HubUrl, token });

      client.bind(client.events.onData, (message) => {
        const data = JSON.parse(message);
        logger.data(`[ssi-wss-onData] raw message \n${message}`);

        io.emit("marketData", message);
      });

      client.bind(client.events.onConnected, () => {
        logger.success("[ssi-wss-onConnected] ssi-fc-data wss connected");

        client.switchChannel("MI:VNINDEX-VN30-HNXINDEX-HNX30");

        // client.switchChannel("X-QUOTE:SSI"); // Single stock
        // client.switchChannel("X-QUOTE:SSI-ACB-VND"); // Multiple stocks
        // client.switchChannel("X-QUOTE:ALL"); // All stocks

        // client.switchChannel("X-TRADE:SSI");
        // client.switchChannel("X-TRADE:ALL");
      });

      client.start();
    } else {
      console.error(
        "[ssi-wss] Failed to fetch access token:",
        response.data.message || "No access token returned"
      );
    }
  } catch (error) {
    console.error("[ssi-wss] Error initializing streaming:", error);
  }
}

export async function initializeRestApi() {
  const cfg = ssiConfig();

  try {
    const response = await axios.post(
      cfg.market.ApiUrl + client.api.GET_ACCESS_TOKEN,
      {
        consumerID: cfg.market.ConsumerId,
        consumerSecret: cfg.market.ConsumerSecret,
      }
    );

    if (response.data.status === 200) {
      const token = "Bearer " + response.data.data.accessToken;

      axios.interceptors.request.use((axios_config) => {
        axios_config.headers.Authorization = token;
        return axios_config;
      });

      logger.success("[rest-api] ssi-fc-data authorization setup complete");
    } else {
      logger.error(
        "[rest-api] failed to fetch access token:",
        response.data.message
      );
    }
  } catch (error) {
    logger.error("[rest-api] error initializing REST API connection:", error);
  }
}
