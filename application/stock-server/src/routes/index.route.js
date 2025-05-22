import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";

const router = express.Router();
const config = ssiConfig();

router.post("/IndexComponents", (req, res) => {
  const { indexCode = "", pageIndex = 4, pageSize = 100 } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_INDEX_COMPONENTS}`, {
      params: {
        "lookupRequest.indexCode": indexCode,
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

router.post("/IndexList", (req, res) => {
  const { exchange = "", pageIndex = 4, pageSize = 100 } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_INDEX_LIST}`, {
      params: {
        "lookupRequest.exchange": exchange,
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

router.post("/DailyIndex", (req, res) => {
  const {
    indexId = "HNX30",
    fromDate = "16/12/2021",
    toDate = "16/12/2021",
    pageIndex = 1,
    pageSize = 1000,
    ascending = true,
  } = req.body;

  axios
    .get(`${config.market.ApiUrl}${client.api.GET_DAILY_INDEX}`, {
      params: {
        "lookupRequest.indexId": indexId,
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
