from vnstock import Listing
from fuzzywuzzy import fuzz

listing = Listing()
def load_stock_mapping():
    df = listing.symbols_by_exchange()
    ddf = df.dropna(subset=['symbol', 'organ_name', 'exchange'])
    # Filter only for stocks listed on HOSE, HNX, or UPCOM
    valid_floors = {'HOSE', 'HNX', 'UPCOM'}
    df = df[df['exchange'].isin(valid_floors)]

    company_map = {name.upper(): code for name, code in zip(df['organ_name'], df['symbol'])}
    stock_list = df['symbol'].unique().tolist()
    floor_map = {code: floor for code, floor in zip(df['symbol'], df['exchange'])}

    return company_map, stock_list, floor_map

def extract_all_stock_codes(text, url = "", stock_list=None, company_map=None, threshold=100):
    text_upper = text.upper()
    matched_codes = set()

    # Fuzzy match by company name
    if company_map:
        for company_name, code in company_map.items():
            score = fuzz.token_set_ratio(company_name.upper(), text_upper)
            if score >= threshold:
                matched_codes.add(code)

    # Direct match by ticker symbol
    if stock_list:
        for code in stock_list:
            if f" {code} " in text_upper or f"({code})" in text_upper or f"{code}:" in text_upper:
                matched_codes.add(code)

    return list(matched_codes)