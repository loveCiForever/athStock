import axios from "axios";
import fs from "fs";
import path from "path";

const hnx30 = [
  "BVS",
  "CAP",
  "CEO",
  "DHT",
  "DTD",
  "DVM",
  "DXP",
  "HUT",
  "IDC",
  "IDV",
  "L14",
  "L18",
  "LAS",
  "LHC",
  "MBS",
  "NTP",
  "PLC",
  "PSD",
  "PVB",
  "PVC",
  "PVI",
  "PVS",
  "SHS",
  "SLS",
  "TMB",
  "TNG",
  "TVD",
  "VC3",
  "VCS",
  "VGP",
];

const BASE_URL = "http://localhost:3000/ssi/Securities";

async function fetchAllHOSECompanies() {
  try {
    const response = await axios.post(BASE_URL, {
      market: "HOSE",
      pageIndex: 1,
      pageSize: 1000,
    });

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      console.error("Lỗi khi fetch danh sách HOSE:", response.data.message);
      return [];
    }
  } catch (err) {
    console.error("Lỗi kết nối API HOSE:", err.message);
    return [];
  }
}

async function fetchCompanyDetail(symbol) {
  try {
    const url = `${BASE_URL}/${symbol}`;
    const response = await axios.get(url);

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      console.error(`Lỗi fetch chi tiết ${symbol}:`, response.data.message);
      return null;
    }
  } catch (err) {
    console.error(`Lỗi kết nối API chi tiết ${symbol}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("Đang fetch danh sách công ty HOSE...");
  const allCompanies = await fetchAllHOSECompanies();

  if (allCompanies.length === 0) {
    console.warn(
      "Không lấy được dữ liệu HOSE hoặc mảng rỗng. Dừng chương trình."
    );
    return;
  }

  const filtered = allCompanies.filter((company) =>
    hnx30.includes(company.Symbol)
  );
  console.log(`Tìm thấy ${filtered.length} công ty nằm trong VN30.`);

  const hnx30Details = [];

  for (let i = 0; i < filtered.length; i++) {
    const symbol = filtered[i].Symbol;
    console.log(`- Đang fetch detail của ${symbol}...`);
    const detail = await fetchCompanyDetail(symbol);

    if (detail) {
      hnx30Details.push(detail);
    } else {
      console.warn(`  -> Bỏ qua ${symbol} vì fetch lỗi.`);
    }
  }

  const outputPath = path.join("vn30Details.json");
  fs.writeFileSync(outputPath, JSON.stringify(hnx30Details, null, 2), "utf-8");
  console.log(`Hoàn tất! Đã ghi thông tin VN30 vào: ${outputPath}`);
}

main().catch((err) => {
  console.error("Lỗi trong main():", err);
});
