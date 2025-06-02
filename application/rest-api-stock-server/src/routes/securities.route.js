import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";
import NodeCache from "node-cache";
import { isStringEmpty, isNumberEmpty } from "../services/helper-function.js";

const router = express.Router();
const config = ssiConfig();

router.post("/Securities", async (req, res) => {
  try {
    const { market, pageIndex, pageSize } = req.body;

    if (
      isStringEmpty(market) ||
      isNumberEmpty(pageIndex) ||
      isNumberEmpty(pageSize)
    ) {
      return res.status(400).json({
        success: false,
        message: `Fetch company list of ${market} failed`,
        error: "market code, pageIndex, pageSize are required",
      });
    }

    const response = await axios.get(
      `${config.market.ApiUrl}${client.api.GET_SECURITIES_LIST}`,
      {
        params: {
          "lookupRequest.market": market,
          "lookupRequest.pageIndex": pageIndex,
          "lookupRequest.pageSize": pageSize,
        },
      }
    );

    if (response.data.status === "Error" && response.data.data === null) {
      return res.status(400).json({
        success: false,
        message: `Fetch company list of ${market} failed`,
        error: response.data.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetch company list of ${market} successful`,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Fetch company list of ${market} failed`,
      error: error.stack,
    });
  }
});



router.post("/SecuritiesDetails", async (req, res) => {
  const { market, symbol, pageIndex, pageSize } = req.body;

  try {
    if (
      isStringEmpty(market) ||
      isStringEmpty(symbol) ||
      isNumberEmpty(pageIndex) ||
      isNumberEmpty(pageSize)
    ) {
      return res.status(400).json({
        success: false,
        message: `Fetch company details failed`,
        error: "market code, symbol code, pageIndex, pageSize are required",
      });
    }

    const response = await axios.get(
      `${config.market.ApiUrl}${client.api.GET_SECURITIES_DETAILs}`,
      {
        params: {
          "lookupRequest.market": market,
          "lookupRequest.symbol": symbol,
          "lookupRequest.pageIndex": pageIndex,
          "lookupRequest.pageSize": pageSize,
        },
      }
    );

    if (response.data.status === "NoDataFound") {
      return res.status(400).json({
        success: false,
        message: `Fetch company details of ${symbol} - ${market} failed`,
        error: response.data.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetch company details of ${symbol} - ${market} successful`,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Fetch company details of ${symbol} - ${market} failed`,
      error: error.stack,
    });
  }
});

export default router;
