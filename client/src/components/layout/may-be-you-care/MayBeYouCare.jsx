import StockCard from "../../ui/card/StockCard";
import InfoIcon from "../../../assets/icon/infoIcon.png";
import { useEffect, useState } from "react";

const MayBeYouCare = () => {
  const [demoStockData, setDemoStockData] = useState({
    acb: {
      data: [
        {
          symbol: "ACB",
          companyName: "Asia Commercial Bank",
          openPrice: 120,
          currentPrice: 100,
          changePercentage: -16.67,
        },
      ],
    },
    vic: {
      data: [
        {
          symbol: "VIC",
          companyName: "Vingroup JSC",
          openPrice: 100,
          currentPrice: 95,
          changePercentage: -5,
        },
      ],
    },
    fpt: {
      data: [
        {
          symbol: "FPT",
          companyName: "FPT Corporation",
          openPrice: 80,
          currentPrice: 85,
          changePercentage: 6.25,
        },
      ],
    },
    vnm: {
      data: [
        {
          symbol: "VNM",
          companyName: "Vinamilk",
          openPrice: 150,
          currentPrice: 145,
          changePercentage: -3.33,
        },
      ],
    },
    hpg: {
      data: [
        {
          symbol: "HPG",
          companyName: "Hoa Phat Group",
          openPrice: 50,
          currentPrice: 52,
          changePercentage: 4,
        },
      ],
    },
    sab: {
      data: [
        {
          symbol: "SAB",
          companyName: "Sabeco",
          openPrice: 200,
          currentPrice: 210,
          changePercentage: 5,
        },
      ],
    },
    vin: {
      data: [
        {
          symbol: "VIN",
          companyName: "VinFast",
          openPrice: 120,
          currentPrice: 115,
          changePercentage: -4.17,
        },
      ],
    },
    mwg: {
      data: [
        {
          symbol: "MWG",
          companyName: "Mobile World Investment Corporation",
          openPrice: 90,
          currentPrice: 92,
          changePercentage: 2.22,
        },
      ],
    },
    tpb: {
      data: [
        {
          symbol: "TPB",
          companyName: "TPBank",
          openPrice: 30,
          currentPrice: 32,
          changePercentage: 6.67,
        },
      ],
    },
    hdb: {
      data: [
        {
          symbol: "HDB",
          companyName: "HDBank",
          openPrice: 40,
          currentPrice: 38,
          changePercentage: -5,
        },
      ],
    },
  });

  useEffect(() => {
    console.log(demoStockData.acb.data[0]);
  });
  return (
    <div className="flex flex-col items-start justify-center w-[800px] bg-red-100//">
      <div className="flex items-center justify-start w-full mb-4">
        <h1 className="text-xl font-semibold text-gray-600">May be you care</h1>
        <div className="relative inline-block group">
          <button className="focus:outline-none">
            <img
              src={InfoIcon}
              alt="Info"
              className="w-[17px] mb-[2px] ml-[7px]"
            />
          </button>
          <span className="absolute left-1/2 transform -translate-x-1/2 mt-[30px] w-[200px] p-[10px] bg-white border-[2px] shadow-sm text-gray-700 text-sm rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none tracking-normal font-inter// text-[14px]">
            The system relies on your recent search content, the types of
            securities you follow, and other activities to generate this list
          </span>
        </div>
      </div>

      <StockCard
        symbol={demoStockData.acb.data[0].symbol}
        companyName={demoStockData.acb.data[0].companyName}
        openPrice={demoStockData.acb.data[0].openPrice}
        currentPrice={demoStockData.acb.data[0].currentPrice}
        changePercentage={demoStockData.acb.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.vic.data[0].symbol}
        companyName={demoStockData.vic.data[0].companyName}
        openPrice={demoStockData.vic.data[0].openPrice}
        currentPrice={demoStockData.vic.data[0].currentPrice}
        changePercentage={demoStockData.vic.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.fpt.data[0].symbol}
        companyName={demoStockData.fpt.data[0].companyName}
        openPrice={demoStockData.fpt.data[0].openPrice}
        currentPrice={demoStockData.fpt.data[0].currentPrice}
        changePercentage={demoStockData.fpt.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.hdb.data[0].symbol}
        companyName={demoStockData.hdb.data[0].companyName}
        openPrice={demoStockData.hdb.data[0].openPrice}
        currentPrice={demoStockData.hdb.data[0].currentPrice}
        changePercentage={demoStockData.hdb.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.mwg.data[0].symbol}
        companyName={demoStockData.mwg.data[0].companyName}
        openPrice={demoStockData.mwg.data[0].openPrice}
        currentPrice={demoStockData.mwg.data[0].currentPrice}
        changePercentage={demoStockData.mwg.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.vin.data[0].symbol}
        companyName={demoStockData.vin.data[0].companyName}
        openPrice={demoStockData.vin.data[0].openPrice}
        currentPrice={demoStockData.vin.data[0].currentPrice}
        changePercentage={demoStockData.vin.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.tpb.data[0].symbol}
        companyName={demoStockData.tpb.data[0].companyName}
        openPrice={demoStockData.tpb.data[0].openPrice}
        currentPrice={demoStockData.tpb.data[0].currentPrice}
        changePercentage={demoStockData.tpb.data[0].changePercentage}
      />
      <StockCard
        symbol={demoStockData.hpg.data[0].symbol}
        companyName={demoStockData.hpg.data[0].companyName}
        openPrice={demoStockData.hpg.data[0].openPrice}
        currentPrice={demoStockData.hpg.data[0].currentPrice}
        changePercentage={demoStockData.hpg.data[0].changePercentage}
      />
    </div>
  );
};

export default MayBeYouCare;
