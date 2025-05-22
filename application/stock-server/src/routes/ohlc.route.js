import express, { Router } from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";

const router = express.Router();
const config = ssiConfig();

router.post("/DailyOhlc", async (req, res) => {
  const {
    symbol = "ACB",
    fromDate = "19/05/2025",
    toDate = "19/05/2025",
    pageIndex = 1,
    pageSize = 100,
    ascending = true,
  } = req.body;

  try {
    const response = await axios.get(
      `${config.market.ApiUrl}${client.api.GET_DAILY_OHLC}`,
      {
        params: {
          "lookupRequest.symbol": symbol,
          "lookupRequest.fromDate": fromDate,
          "lookupRequest.toDate": toDate,
          "lookupRequest.pageIndex": pageIndex,
          "lookupRequest.pageSize": pageSize,
          "lookupRequest.ascending": ascending,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("SSI API error:", error.response?.status, error.message);
    return res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Server Error");
  }
});

router.post("/IntradayOhlc", (req, res) => {
  const {
    symbol = "ACB",
    fromDate = "20/05/2025",
    toDate = "20/05/2025",
    pageIndex = 1,
    pageSize = 100,
    ascending = true,
  } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_INTRADAY_OHLC}`, {
      params: {
        "lookupRequest.symbol": symbol,
        "lookupRequest.fromDate": fromDate,
        "lookupRequest.toDate": toDate,
        "lookupRequest.pageIndex": pageIndex,
        "lookupRequest.pageSize": pageSize,
        "lookupRequest.ascending": ascending,
      },
    })
    .then((response) => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    })
    .catch((error) => {
      console.log(error);
    });
});

export default router;
