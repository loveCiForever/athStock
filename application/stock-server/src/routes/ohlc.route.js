import express, { Router } from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";
import fs from "fs/promises";

import path from "path";

const router = express.Router();
const config = ssiConfig();

const vn100Path = path.resolve("src/data/VN100_IndexComponents.json");
const vn30Path = path.resolve("src/data/VN30_IndexComponents.json");
const hosePath = path.resolve("src/data/HOSE_Securities.json");

const vn100Json = JSON.parse(await fs.readFile(vn100Path, "utf8"));
const vn30Json = JSON.parse(await fs.readFile(vn30Path, "utf8"));
const hoseJson = JSON.parse(await fs.readFile(hosePath, "utf8"));

const vn30Symbols =
  vn30Json.data?.[0]?.IndexComponent.map((c) => c.StockSymbol) || [];

const vn100Symbols =
  vn100Json.data?.[0]?.IndexComponent.map((c) => c.StockSymbol) || [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/vn30-intraday", async (req, res) => {
  const {
    fromDate = "01/01/2025",
    toDate = "01/01/2025",
    pageIndex = 1,
    pageSize = 100,
    ascending = false,
  } = req.body;

  try {
    const results = [];

    for (const symbol of vn30Symbols) {
      const resp = await axios.get(
        `${config.market.ApiUrl}${client.api.GET_INTRADAY_OHLC}`,
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

      // console.log(resp);

      const data = resp.data?.data || [];
      const total = Array.isArray(data) ? data.length : 0;

      const info = hoseJson.data?.find((c) => c.Symbol === symbol) || {};

      results.push({
        symbol,
        stockName: info.StockName || null,
        stockEnName: info.StockEnName || null,
        total_record: total,
        data,
      });

      sleep(1000);
    }

    return res.status(200).json({
      success: true,
      message: `Fetch intraday OHLC của VN30 thành công`,
      data: results,
      total_symbols: results.length,
    });
  } catch (error) {
    console.error("Error /vn30-intraday:", error);
    return res.status(500).json({
      success: false,
      message: `Fetch intraday OHLC của VN30 thất bại`,
      detail: error.stack,
    });
  }
});

router.post("/vn100-intraday", async (req, res) => {
  const {
    fromDate = "01/01/2025",
    toDate = "01/01/2025",
    pageIndex = 1,
    pageSize = 100,
    ascending = false,
  } = req.body;

  try {
    const results = [];

    for (const symbol of vn100Symbols) {
      const resp = await axios.get(
        `${config.market.ApiUrl}${client.api.GET_INTRADAY_OHLC}`,
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

      // console.log(resp);

      const data = resp.data?.data || [];
      const total = Array.isArray(data) ? data.length : 0;

      const info = hoseJson.data?.find((c) => c.Symbol === symbol) || {};

      results.push({
        symbol,
        stockName: info.StockName || null,
        stockEnName: info.StockEnName || null,
        total_record: total,
        data,
      });

      sleep(1000);
    }

    return res.status(200).json({
      success: true,
      message: `Fetch intraday OHLC của VN100 thành công`,
      data: results,
      total_symbols: results.length,
    });
  } catch (error) {
    console.error("Error /vn100-intraday:", error);
    return res.status(500).json({
      success: false,
      message: `Fetch intraday OHLC của VN100 thất bại`,
      detail: error.stack,
    });
  }
});

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
      // console.log(response);
      return res.status(200).json({
        success: true,
        message: `Fetch intraday OHLC price of ${symbol} successful`,
        data: response.data,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: `Fetch intraday OHLC price of ${symbol} failed`,
        detail: error.stack,
      });
    });
});

/**
 * POST /api/stock/top-intraday
 * Body:
 * {
 *   "indexCode": "VN30",
 *   "fromDate": "23/04/2025",
 *   "toDate": "23/05/2025",
 *   "pageIndex": 1,
 *   "pageSize": 10,
 *   "ascending": false
 * }
 */

router.post("/top-intraday", async (req, res) => {
  const {
    indexCode = "VN30",
    fromDate = "23/04/2025",
    toDate = "23/05/2025",
    pageIndex = 1,
    pageSize = 1000,
    ascending = false,
  } = req.body;

  try {
    const idxResp = await axios.post(
      `http://localhost:3000/ssi/IndexComponents`,
      { indexCode, pageIndex, pageSize }
    );

    // console.log(idxResp);
    if (idxResp.data == null) {
      return res.status(500).json({
        message: `Fetch intraday OHLC price of ${indexCode} failed`,
        detail: error.stack,
      });
    }

    const stockList = idxResp.data.data[0].IndexComponent;
    // console.log(stockList);

    const results = [];
    for (const item of stockList) {
      const symbol = item.StockSymbol;
      const ohlcResp = await axios.get(
        `${config.market.ApiUrl}${client.api.GET_INTRADAY_OHLC}`,
        {
          params: {
            "lookupRequest.symbol": symbol,
            "lookupRequest.fromDate": fromDate,
            "lookupRequest.toDate": toDate,
            "lookupRequest.pageIndex": pageIndex,
            "lookupRequest.pageSize": 1,
            "lookupRequest.ascending": ascending,
          },
        }
      );

      const arr = ohlcResp.data?.data;
      if (Array.isArray(arr) && arr.length > 0) {
        results.push({
          symbol,
          total_record: arr.length,
          data: arr,
        });
      } else {
        console.log(`No intraday data for ${symbol}, skip.`);
      }

      await sleep(0);
    }

    // console.log(results);

    return res.status(200).json({
      success: true,
      message: `Fetch intraday OHLC price of ${indexCode} successful`,
      data: results,
      total_record: results.length,
    });
  } catch (error) {
    console.error("Error /top-intraday:", error);
    return res.status(500).json({
      message: `Fetch intraday OHLC price of ${indexCode} failed`,
      detail: error.stack,
    });
  }
});

export default router;
