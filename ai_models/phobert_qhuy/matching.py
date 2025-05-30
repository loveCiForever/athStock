import json
import os
from flashtext import KeywordProcessor # type: ignore
import pandas as pd
from vnstock_script import price_before_and_after
from datetime import datetime

with open("./data/raw/articles/articles.json", encoding="utf-8") as f:
    data = json.load(f)

df_symbols = pd.read_csv("./data/raw/symbols/vn30.csv")
symbol_list = df_symbols["symbol"].astype(str).tolist()

processor = KeywordProcessor(case_sensitive=True)
for sym in symbol_list:
    processor.add_keyword(sym)


for site in ["cafef", "vietstock", "vnexpress"]:
    for art in data.get(site, []):
        pub_raw = art.get("publish_date")
        if not pub_raw or not art.get("symbols_mentioned"):
            art["impact"] = {}
            continue

        pub_dt_str = (pub_raw)
        impacts = {}

        for sym in art["symbols_mentioned"]:
            try:
                prices = price_before_and_after(symbol=sym, publish_datetime=pub_dt_str)
            except Exception as e:
                print(f"[Error] {art['title']} – {sym}: {e}")
                continue

            if prices is None or len(prices) < 2:
                impacts[sym] = {
                    "price_before": None,
                    "price_after":  None,
                    "pct_change":   None
                }
            else:
                before, after = prices[0], prices[1]
                pct = None
                if after > before:
                    trend = 'increase'
                elif after == before:
                    trend = 'unchanged'
                else:
                    trend = 'decrease'
                if before:
                    pct = round((after - before) / before * 100, 2)

                impacts[sym] = {
                    "price_before": before,
                    "price_after":  after,
                    "trend":        trend,
                    "pct_change":   pct
                }

        art["impact"] = impacts

output_dir = "./data/processed/articles_with_impact"
os.makedirs(output_dir, exist_ok=True)
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

with open(f"{output_dir}/articles_impact_to_vn30.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Saved impact results to {output_dir}/articles_impact_to_vn30.json")