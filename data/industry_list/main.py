from vnstock import Listing, Quote, Company, Finance, Trading, Screener, Vnstock
import pandas as pd

stock = Vnstock().stock(symbol='ACB', source='VCI')

df = stock.listing.industries_icb()
# csv_output = df.to_csv(index=False)
df.to_csv('industries.csv', index=True)

json_output = df.to_json(orient='records', lines=False, force_ascii=False)
with open('industries.json', 'w', encoding='utf-8') as f:
    f.write(json_output)