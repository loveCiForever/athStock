from vnstock import Vnstock
import pandas as pd
import os
import json

def get_index(index_symbol="vnindex", source="VCI", start_date="2020-01-01", end_date="2022-01-01", interval="1D"):
    stock = Vnstock().stock(symbol="ACB", source=source)

    df = stock.quote.history(symbol=index_symbol, start=start_date, end=end_date, interval=interval)

    os.makedirs(f"./{index_symbol}", exist_ok=True)
    # df.to_csv(f"./{index_symbol}/{index_symbol}.csv", index=True)

    result = {
        "success": True,
        "message": "Data fetched successfully",
        "data": {
            "symbol": index_symbol.lower(),
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

    with open(f"./{index_symbol}/{index_symbol}.json", 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"{index_symbol.upper()} data saved to CSV and JSON.")

if __name__ == "__main__":
    get_index(index_symbol="vnindex", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")
    get_index(index_symbol="hnxindex", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")
    get_index(index_symbol="vn30", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")
    get_index(index_symbol="hnx30", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")
