import express from "express";
import axios from "axios";
import { ssiConfig } from "../configs/ssi.config.js";
import client from "ssi-fcdata";
import NodeCache from "node-cache";

const router = express.Router();
const config = ssiConfig();

const indexComponentsCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const indexListCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const dailyIndexCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

router.post("/IndexComponents", async (req, res) => {
  const { indexCode = "", pageIndex = 4, pageSize = 100 } = req.body;
  const cacheKey = `indexComp_${indexCode}_${pageIndex}_${pageSize}`;

  const cached = indexComponentsCache.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: `Fetch index component of ${indexCode} successful (from cache)`,
      data: cached,
    });
  }

  try {
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

    const list = response.data.data || [];
    // lưu vào cache
    indexComponentsCache.set(cacheKey, list);

    return res.status(200).json({
      success: true,
      message: `Fetch index component of ${indexCode} successful`,
      data: list,
    });
  } catch (error) {
    console.error("Error /IndexComponents:", error);
    return res.status(500).json({
      success: false,
      message: `Fetch index component of ${indexCode} failed`,
      error: error.stack,
    });
  }
});

router.post("/IndexList", async (req, res) => {
  const { exchange = "HOSE", pageIndex = 1, pageSize = 100 } = req.body;
  const cacheKey = `indexList_${exchange}_${pageIndex}_${pageSize}`;

  const cached = indexListCache.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: `Fetch index list of ${exchange} successful (from cache)`,
      data: cached,
      total_record: Array.isArray(cached) ? cached.length : 0,
    });
  }

  try {
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
    const list = response.data.data || [];

    indexListCache.set(cacheKey, list);

    return res.status(200).json({
      success: true,
      message: `Fetch index list of ${exchange} successful`,
      data: list,
      total_record: list.length,
    });
  } catch (error) {
    console.error("Error /IndexList:", error);
    return res.status(500).json({
      success: false,
      message: `Fetch index list of ${exchange} failed`,
      error: error.stack,
    });
  }
});

router.post("/DailyIndex", async (req, res) => {
  const {
    indexId = "HNX30",
    fromDate = "16/12/2021",
    toDate = "16/12/2021",
    pageIndex = 1,
    pageSize = 1000,
    ascending = true,
  } = req.body;

  const cacheKey = `dailyIndex_${indexId}_${fromDate}_${toDate}_${pageIndex}_${pageSize}_${ascending}`;
  if (!indexId) {
    return res.status(400).json({
      success: false,
      message: "Miss indexId",
    });
  }

  const cached = dailyIndexCache.get(cacheKey);
  // console.log(cached);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: `Fetch daily index of ${indexId} successful (from cache)`,
      data: cached.data,
      total_record: cached.total_record,
    });
  }

  try {
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

    const list = response.data.data || [];
    const total = Array.isArray(list) ? list.length : 0;

    if (list.length > 0) {
      dailyIndexCache.set(cacheKey, { data: list, total_record: total });
    }

    return res.status(200).json({
      success: true,
      message: `Fetch daily index of ${indexId} successful`,
      data: list,
      total_record: total,
    });
  } catch (error) {
    console.error("Error /DailyIndex:", error);
    return res.status(500).json({
      success: false,
      message: `Fetch daily index of ${indexId} failed`,
      error: error.stack,
    });
  }
});

export default router;
