import os
import pandas as pd
from vnstock3 import Vnstock

def fetch_data(stock_code, start_date, end_date, save_path):
    try:
        print(f"fetching data {stock_code} from {start_date} to {end_date}...")
        stock = Vnstock().stock(symbol=stock_code, source="TCBS")
        df = stock.quote.history(start=start_date, end=end_date, interval="1D")

        if df is None or df.empty:
            print(f"⚠ Cant found data of {stock_code}!")
            return
        
        df.to_csv(save_path, index=False)
        print(f"Saved data of {stock_code} to {save_path}")
        return df
    except Exception as e:
        print(f"Error: {e}")

def check_path(directory):
    if not os.path.exists(directory):
      os.makedirs(directory)
    else:
      pass

