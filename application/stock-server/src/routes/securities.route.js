import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";
import NodeCache from "node-cache";

const router = express.Router();
const config = ssiConfig();

let cache = {
  data: null,
  fetchedAt: 0,
};
const TTL = 60 * 60 * 1000;

async function ensureSecuritiesCache(
  market = "HOSE",
  pageIndex = 1,
  pageSize = 1000
) {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < TTL) {
    return cache.data;
  }

  const resp = await axios.get(
    `${config.market.ApiUrl}${client.api.GET_SECURITIES_LIST}`,
    {
      params: {
        "lookupRequest.market": market,
        "lookupRequest.pageIndex": pageIndex,
        "lookupRequest.pageSize": pageSize,
      },
    }
  );
  cache.data = resp.data.data;
  cache.fetchedAt = now;
  return cache.data;
}

router.post("/Securities", async (req, res) => {
  try {
    const { market = "HOSE", pageIndex = 1, pageSize = 100 } = req.body;
    const list = await ensureSecuritiesCache(market, pageIndex, pageSize);
    return res.status(200).json({
      success: true,
      message: `Fetch company list of ${market} successful`,
      data: list,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Fetch company list failed`,
      error: error.stack,
    });
  }
});

router.get("/Securities/:symbol", async (req, res) => {
  try {
    const symbolParam = req.params.symbol.toUpperCase();
    const list = await ensureSecuritiesCache("HOSE", 1, 1000);
    const item = list.find((x) => x.Symbol.toUpperCase() === symbolParam);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thông tin cho symbol=${symbolParam}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetch details of ${symbolParam} successful`,
      data: item,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Fetch details failed`,
      error: error.stack,
    });
  }
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
    .then((response) => {
      if (response.data.data[0] === null) {
        res.status(500).send("Server Error");
      }
      res.status(200).json({
        success: true,
        message: `Fetch company details of ${symbol} - ${market} successful`,
        data: response.data.data,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
});

export default router;
