import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";

const router = express.Router();
const config = ssiConfig();

router.post("/DailyStockPrice", (req, res) => {
  const {
    symbol = "ACB",
    market = "HOSE",
    fromDate = "01/12/2021",
    toDate = "17/12/2021",
    pageIndex = 1,
    pageSize = 1000,
  } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_DAILY_STOCKPRICE}`, {
      params: {
        "lookupRequest.symbol": symbol,
        "lookupRequest.market": market,
        // "lookupRequest.fromDate": fromDate
        "lookupRequest.toDate": toDate,
        "lookupRequest.pageIndex": pageIndex,
        "lookupRequest.pageSize": pageSize,
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
