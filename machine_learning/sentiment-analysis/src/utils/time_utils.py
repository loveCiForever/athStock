import pandas as pd
from datetime import datetime, timedelta

def date_range(start_date, end_date, fmt="%Y-%m-%d"):
    start = datetime.strptime(start_date, fmt)
    end = datetime.strptime(end_date, fmt)
    delta = (end - start).days
    return [(start + timedelta(days=i)).strftime(fmt) for i in range(delta + 1)]

def parse_date(date_str, fmt="%Y-%m-%d"):
    return datetime.strptime(date_str, fmt)

def format_date(date_obj, fmt="%Y-%m-%d"):
    return date_obj.strftime(fmt)

def fill_missing_dates(df, date_col="time", value_cols=None, method="ffill", fmt="%Y-%m-%d"):
    df[date_col] = pd.to_datetime(df[date_col], format=fmt)
    df = df.set_index(date_col).asfreq('D')
    if value_cols:
        df[value_cols] = df[value_cols].fillna(method=method)
    else:
        df = df.fillna(method=method)
    df = df.reset_index()
    df[date_col] = df[date_col].dt.strftime(fmt)
    return df 