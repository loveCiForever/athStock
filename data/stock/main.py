from vnstock import Listing, Quote, Company, Finance, Trading, Screener, Vnstock
import pandas as pd
import os
import json

def get_stock(symbol="acb", source="VCI", start_date="2020-01-01", end_date="2022-01-01", interval="1D"):
    stock = Vnstock().stock(symbol=symbol, source=source)
    df = stock.quote.history(start=start_date, end=end_date, interval=interval)
    
    os.makedirs(f"./{symbol}/", exist_ok=True)
    # df.to_csv(f"./{symbol}/{symbol}.csv", index=True)
    
    result = {
        "success": True,
        "message": "Data fetched successfully",
        "data": {
            "symbol": symbol.lower(),
            "data": {}
        }
    }

    for _, row in df.iterrows():
        date = str(row['time'])[:10] 
        result["data"]["data"][date] = {
            "open": f"{row['open']:.4f}",
            "high": f"{row['high']:.4f}",
            "low": f"{row['low']:.4f}",
            "close": f"{row['close']:.4f}",
            "volume": str(int(row['volume']))
        }

    with open(f"./{symbol}/{symbol}.json", 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"{symbol.upper()} data saved to CSV and JSON.")
if __name__ == "__main__":
    
    stocks = ['acb', 'fpt', 'vcb', 'bid', 'ctg', 'mbb', 'vic', 'vjc', 'ssi', 'vib', 'tpb', 'bvh' ]
    
    for stock in stocks:
        get_stock(symbol=stock, source="VCI", start_date="2024-01-01", end_date="2025-01-01", interval="1D")
    
        