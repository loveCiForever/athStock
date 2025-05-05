from vnstock import Listing, Quote, Company, Finance, Trading, Screener, Vnstock
import pandas as pd

def get_index(index_symbol="vnindex", source="VCI", start_date="2020-01-01", end_date="2022-01-01", interval="1D"):
    stock = Vnstock().stock(symbol="ACB", source=source)

    df = stock.quote.history(symbol=index_symbol, start=start_date, end=end_date, interval=interval)
    df.to_csv(f"./{index_symbol}/{index_symbol}.csv", index=True)

    json_output = df.to_json(orient='records', lines=False, force_ascii=False)
    with open(f"./{index_symbol}/{index_symbol}.json", 'w', encoding='utf-8') as f:
        f.write(json_output)
    
    
if __name__ == "__main__":
    get_index(index_symbol="vnindex", source="VCI", start_date="2020-01-01", end_date="2025-05-05", interval="1D")
    
    # get_index(index_symbol="hnxindex", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")
    
    # get_index(index_symbol="vn30", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")
    
    # get_index(index_symbol="hnx30", source="VCI", start_date="2024-01-01", end_date="2025-05-05", interval="1D")