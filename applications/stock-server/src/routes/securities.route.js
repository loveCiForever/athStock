import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";

const router = express.Router();
const config = ssiConfig();

router.post("/Securities", (req, res) => {
  const { market = "HOSE", pageIndex = 4, pageSize = 100 } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_SECURITIES_LIST}`, {
      params: {
        "lookupRequest.market": market,
        "lookupRequest.pageIndex": pageIndex,
        "lookupRequest.pageSize": pageSize,
      },
    })
    .then((response) => res.json(response.data))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
});

router.post("/SecuritiesDetails", (req, res) => {
  const {
    market = "HOSE",
    symbol = "ACB",
    pageIndex = 4,
    pageSize = 100,
  } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_SECURITIES_DETAILs}`, {
      params: {
        "lookupRequest.market": market,
        "lookupRequest.symbol": symbol,
        "lookupRequest.pageIndex": pageIndex,
        "lookupRequest.pageSize": pageSize,
      },
    })
    .then((response) => res.json(response.data))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
});

export default router;
