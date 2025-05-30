import pandas as pd
import os
from vnstock import Vnstock
from datetime import datetime, timedelta

from utils.helper_function import extract_datetime

stock = Vnstock().stock(symbol='ACB', source='VCI')

"""
Lists stock symbols by a specific group and optionally saves the result to a CSV file.

Args:
    group (str): The stock group to fetch symbols for (e.g., 'VN30').
    to_csv (bool): Whether to save the result to a CSV file.

Returns:
    None

Behavior:
    - Fetches the stock symbols for the specified group using `stock.listing.symbols_by_group`.
    - Creates the directory `./data/symbols` if it does not exist.
    - Saves the result to a CSV file named `<group>.csv` in the `./data/symbols` directory if `to_csv` is True.

Example:
    >>> listing_symbols_by_group(group='VN30', to_csv=True)
    Saved VN30.csv successfully
"""
def listing_symbols_by_group(group, to_csv):
    if not group or not to_csv:
        print("Group and to_csv are required")
        return

    df = stock.listing.symbols_by_group(group)

    output_dir = "./data/symbols"
    os.makedirs(output_dir, exist_ok=True)

    if(to_csv):
        output_file = os.path.join(output_dir, f"{group}.csv")
        df.to_csv(output_file, index=False)
        print(f"Saved {group}.csv successfully")

    return df


"""
Fetches the stock prices immediately before and 1 hour after a specific datetime.

Args:
    symbol (str): The stock symbol to fetch prices for (e.g., 'ACB').
    publish_datetime (str): The datetime in the format 'HH:MM:SS - DD/MM/YYYY'.

Returns:
    numpy.ndarray: An array containing the close prices before and 1 hour after the publish_datetime.

Example:
    >>> close_before, close_after = price_before_and_after(symbol='ACB', publish_datetime='11:40:00 - 22/05/2025')
    >>> print(close_before, close_after)
    21.47 21.47
"""
def price_before_and_after(symbol, publish_datetime):
    if not symbol or not publish_datetime:
        print("Symbol and publish_datetime are required!")
        return

    publish_dt, target_date = extract_datetime(publish_datetime)

    start_date = (publish_dt - timedelta(days=10)).strftime("%Y-%m-%d")
    end_date = (publish_dt + timedelta(days=10)).strftime("%Y-%m-%d")

    df = stock.quote.history(symbol=symbol, start=start_date, end=end_date, interval='1m')

    if df.empty:
        print(f"No data found for symbol {symbol} around {target_date}")
        return

    df['time'] = pd.to_datetime(df['time'])
    before = df[df['time'] < publish_dt].tail(1)
    after_target_time_1_hour = publish_dt + timedelta(hours=1)
    after = df[df['time'] >= after_target_time_1_hour].head(1)

    result = pd.concat([before, after])
    close_prices = result['close'].values

    return close_prices