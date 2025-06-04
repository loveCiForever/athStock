import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";
import NodeCache from "node-cache";
import {
  isNumberEmpty,
  isStringEmpty,
  logger,
} from "../services/helper.service.js";

const router = express.Router();
const config = ssiConfig();

const indexComponentsCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
router.post("/IndexComponents", async (req, res) => {
  const { indexCode, pageIndex, pageSize } = req.body;

  try {
    if (
      isStringEmpty(indexCode) ||
      isNumberEmpty(pageIndex) ||
      isNumberEmpty(pageSize)
    ) {
      return res.status(400).json({
        success: false,
        message: `Fetch index components failed`,
        error: `indexCode, pageIndex, pageSize are required`,
      });
    }

    const callingDate = new Date().toISOString().split("T")[0];
    const cacheKey = `indexComponents_${indexCode}_${pageIndex}_${pageSize}_${callingDate}`;

    const cachedData = indexComponentsCache.get(cacheKey);
    if (cachedData && cachedData.TotalSymbolNo !== 0) {
      return res.status(200).json({
        success: true,
        message: `Fetch index components of ${indexCode} successful (from cache)`,
        fromCache: true,
        data: cachedData,
      });
    }

    const response = await axios.get(
      `${config.market.ApiUrl}${client.api.GET_INDEX_COMPONENTS}`,
      {
        params: {
          "lookupRequest.indexCode": indexCode,
          "lookupRequest.pageIndex": pageIndex,
          "lookupRequest.pageSize": pageSize,
        },
      }
    );

    if (response.data.status === "NoDataFound") {
      return res.status(404).json({
        success: false,
        message: `Fetch index components of ${indexCode} failed`,
        error: response.data.message,
      });
    }

    indexComponentsCache.set(cacheKey, response.data.data);

    return res.status(200).json({
      success: false,
      fromCache: false,
      message: `Fetch index components of ${indexCode} successful`,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Fetch index component of failed`,
      error: error.stack,
    });
  }
});

const indexListCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
router.post("/IndexList", async (req, res) => {
  const { exchange, pageIndex, pageSize } = req.body;

  try {
    if (
      isStringEmpty(exchange) ||
      isNumberEmpty(pageIndex) ||
      isNumberEmpty(pageSize)
    ) {
      return res.status(400).json({
        success: false,
        message: `Fetch index list failed`,
        error: `exchange code, pageIndex, pageSize are required`,
      });
    }

    const callingDate = new Date().toISOString().split("T")[0];
    const cacheKey = `indexList_${exchange}_${pageIndex}_${pageSize}_${callingDate}`;

    const cachedData = indexListCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        message: `Fetch index list of ${exchange} successful (from cache)`,
        fromCache: true,
        data: cachedData,
      });
    }
    const response = await axios.get(
      `${config.market.ApiUrl}${client.api.GET_INDEX_LIST}`,
      {
        params: {
          "lookupRequest.exchange": exchange,
          "lookupRequest.pageIndex": pageIndex,
          "lookupRequest.pageSize": pageSize,
        },
      }
    );

    if (response.data.status === "Error") {
      return res.status(404).json({
        success: false,
        message: `Fetch index list of ${exchange} failed`,
        error: response.data.message,
      });
    }

    indexListCache.set(cacheKey, response.data.data);
    return res.status(200).json({
      success: true,
      message: `Fetch index list of ${exchange} successful`,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Fetch index list of ${exchange} failed`,
      error: error.stack,
    });
  }
});

const dailyIndexCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
router.post("/DailyIndex", async (req, res) => {
  const {
    indexId,
    fromDate,
    toDate,
    pageIndex,
    pageSize,
    ascending = false,
  } = req.body;

  try {
    if (
      isStringEmpty(indexId) ||
      isStringEmpty(fromDate) ||
      isStringEmpty(toDate) ||
      isNumberEmpty(pageIndex) ||
      isNumberEmpty(pageSize)
    ) {
      return res.status(400).json({
        success: false,
        message: `Fetch index list failed`,
        error: `indexId, date, pageIndex, pageSize are required`,
      });
    }

    const now = new Date();
    const callingDateTime = `${
      now.toISOString().split("T")[0]
    }_${now.getHours()}:${now.getMinutes()}`;
    const cacheKey = `dailyIndex_${indexId}_${fromDate}_${toDate}_${pageIndex}_${pageSize}_${ascending}_${callingDateTime}`;
    const cachedData = dailyIndexCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        cacheKey: cacheKey,
        fromCache: true,
        message: `Fetch daily index of ${indexId} successful (from cache)`,
        data: cachedData,
      });
    }

    const response = await axios.get(
      `${config.market.ApiUrl}${client.api.GET_DAILY_INDEX}`,
      {
        params: {
          "lookupRequest.indexId": indexId,
          "lookupRequest.fromDate": fromDate,
          "lookupRequest.toDate": toDate,
          "lookupRequest.pageIndex": pageIndex,
          "lookupRequest.pageSize": pageSize,
          "lookupRequest.ascending": ascending,
        },
      }
    );

    logger.info(`[daily-index] ${response.data.message}`);

    if (
      response.data.status === "NoDataFound" ||
      response.data.status === 429
    ) {
      return res.status(429).json({
        success: false,
        message: `Fetch daily index point of ${indexId} failed`,
        error: response.data.message,
      });
    }

    dailyIndexCache.set(cacheKey, response.data.data);

    return res.status(200).json({
      success: true,
      message: `Fetch daily index of ${indexId} successful`,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Fetch daily index of ${indexId} failed`,
      error: error.stack,
    });
  }
});

export default router;
