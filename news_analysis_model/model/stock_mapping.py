from vnstock import Listing
from fuzzywuzzy import fuzz
import pandas as pd
import argparse
import os

def parse_args():
    parser = argparse.ArgumentParser(description="Stock mapping utilities")
    parser.add_argument("--cache_path", default="data/stock_cache.pkl", help="Path to cache stock mappings")
    parser.add_argument("--exchanges", default="HOSE,HNX,UPCOM", help="Comma-separated list of exchanges to include")
    return parser.parse_args()

class StockMapper:
    def __init__(self, cache_path="data/stock_cache.pkl", exchanges=None):
        self.cache_path = cache_path
        self.exchanges = set(exchanges.split(',')) if exchanges else {'HOSE', 'HNX', 'UPCOM'}
        self.company_map = None
        self.stock_list = None
        self.floor_map = None
        self._load_mappings()

    def _load_mappings(self):
        # Try loading from cache
        if os.path.exists(self.cache_path):
            try:
                cached_data = pd.read_pickle(self.cache_path)
                self.company_map = cached_data['company_map']
                self.stock_list = cached_data['stock_list']
                self.floor_map = cached_data['floor_map']
                return
            except Exception as e:
                print(f"Warning: Failed to load cache from {self.cache_path}: {e}")
        
        # Load fresh data
        try:
            listing = Listing()
            df = listing.symbols_by_exchange()
            df = df.dropna(subset=['symbol', 'organ_name', 'exchange'])
            df = df[df['exchange'].isin(self.exchanges)]
            if df.empty:
                raise ValueError("No valid stock data found for specified exchanges")
            
            self.company_map = {name.upper(): code for name, code in zip(df['organ_name'], df['symbol'])}
            self.stock_list = df['symbol'].unique().tolist()
            self.floor_map = {code: floor for code, floor in zip(df['symbol'], df['exchange'])}
            
            # Cache the mappings
            os.makedirs(os.path.dirname(self.cache_path), exist_ok=True)
            pd.to_pickle({
                'company_map': self.company_map,
                'stock_list': self.stock_list,
                'floor_map': self.floor_map
            }, self.cache_path)
        except Exception as e:
            raise RuntimeError(f"Error loading stock mappings: {e}")

    def extract_all_stock_codes(self, text, url="", threshold=80):
        if not isinstance(text, str) or not text.strip():
            raise ValueError("Input text must be a non-empty string")
        if not isinstance(threshold, (int, float)) or threshold < 0 or threshold > 100:
            raise ValueError("Threshold must be a number between 0 and 100")

        text_upper = text.upper()
        matched_codes = set()

        # Fuzzy match by company name
        for company_name, code in self.company_map.items():
            score = fuzz.token_set_ratio(company_name, text_upper)
            if score >= threshold:
                matched_codes.add(code)

        # Direct match by ticker symbol
        for code in self.stock_list:
            if f" {code} " in text_upper or f"({code})" in text_upper or f"{code}:" in text_upper:
                matched_codes.add(code)

        return list(matched_codes)

if __name__ == "__main__":
    args = parse_args()
    mapper = StockMapper(cache_path=args.cache_path, exchanges=args.exchanges)
    test_text = "Công ty Cổ phần Vinamilk (VNM) tăng trưởng mạnh."
    codes = mapper.extract_all_stock_codes(test_text, threshold=80)
    print(f"Extracted stock codes: {codes}")