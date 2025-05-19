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

    if (response.data.status === 200) {
      const token = "Bearer " + response.data.data.accessToken;

      axios.interceptors.request.use((axios_config) => {
        axios_config.headers.Authorization = token;
        return axios_config;
      });

      client.initStream({ url: cfg.market.HubUrl, token });
      client.bind(client.events.onData, (message) => console.log(message));
      client.bind(client.events.onConnected, () => {
        client.switchChannel("X-QUOTE:ALL");
      });

      client.start();
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error("Error initializing streaming:", error);
  }
}
