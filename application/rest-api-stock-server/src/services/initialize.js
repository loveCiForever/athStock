import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";

export async function initializeStreaming() {
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
        let parsed = JSON.parse(message);
        let content = parsed.Content;
        console.log(content);
      });

      client.bind(client.events.onConnected, () => {
        console.log("[SSI Streaming] Connected");
        client.switchChannel("MI:VN30");
      });

      client.start();
    } else {
      console.error(
        "[STREAMING] Failed to fetch access token:",
        response.data.message || "No access token returned"
      );
    }
  } catch (error) {
    console.error("[STREAMING] Error initializing streaming:", error);
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

      console.log("[REST API] Authorization setup complete");
    } else {
      console.error(
        "[REST API] Failed to fetch access token:",
        response.data.message
      );
    }
  } catch (error) {
    console.error("[REST API] Error initializing REST API connection:", error);
  }
}
