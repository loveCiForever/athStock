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

const isEmpty = (string) => {
  if (typeof string !== "string" || string === null || string === undefined) {
    return true;
  }

  return string.trim().length === 0;
};

router.post("/IndexComponents", async (req, res) => {
  // const { indexCode = "HOSE", pageIndex = 4, pageSize = 100 } = req.body;

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

    // const response = await axios.get(
    //   `https://msh-appdata.cafef.vn/rest-api/api/v1/StockMarket`
    // );

    // const list = response;
    console.log(response.data.data);

    return res.status(200).json({
      success: true,
      message: `Fetch index component of successful`,
      data: response.data,
    });
  } catch (error) {
    console.error("Error /IndexComponents:", error);
    return res.status(500).json({
      success: false,
      message: `Fetch index component of failed`,
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
    indexId = "",
    fromDate = "",
    toDate = "",
    pageIndex = 1,
    pageSize = 1000,
    ascending = true,
  } = req.body;

  if (isEmpty(indexId)) {
    return res.status(400).json({
      success: false,
      message: "indexId is required. Try VNINDEX, VN30, HNXINDEX, HNX30",
    });
  }

  if (isEmpty(fromDate) || isEmpty(toDate)) {
    return res.status(400).json({
      success: false,
      message: "fromDate and toDate are required",
    });
  }

  if (
    indexId != "VNINDEX" &&
    indexId != "VN30" &&
    indexId != "HNXINDEX" &&
    indexId != "HNX30"
  ) {
    return res.status(400).json({
      success: false,
      message: `${indexId} is not supported. Try VNINDEX, VN30, HNXINDEX, HNX30`,
    });
  }

  // const cacheKey = `dailyIndex_${indexId}_${fromDate}_${toDate}_${pageIndex}_${pageSize}_${ascending}`;

  // const cached = dailyIndexCache.get(cacheKey);
  // // console.log(cached);
  // if (cached) {
  //   return res.status(200).json({
  //     success: true,
  //     message: `Fetch daily index of ${indexId} successful (from cache)`,
  //     data: cached.data,
  //     total_record: cached.total_record,
  //   });
  // }

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

    console.log(`Daily index of ${indexId}: `, response.data);

    if (response.data.status == 429) {
      return res.status(429).json({
        success: false,
        message: response.data.message,
      });
    }

    const list = response.data.data || [];
    const total = Array.isArray(list) ? list.length : 0;

    // if (list.length > 0) {
    //   dailyIndexCache.set(cacheKey, { data: list, total_record: total });
    // }

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
