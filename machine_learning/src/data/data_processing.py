import pandas as pd
from sklearn.preprocessing import StandardScaler
import os
def load_data(file_path):
    try:
        df = pd.read_csv(file_path)
        print(f"Loading data from {file_path}, size: {df.shape}")
        return df
    except Exception as e:
        print(f"Error: {e}")
        return None

def clean_data(df):
    df = df.ffill().bfill()  
    print(f"Size: {df.shape}")
    return df

def create_features(df):
    if "close" in df.columns:
        df["Return"] = df["close"].pct_change()
        df["Volatility"] = df["Return"].rolling(window=10).std()
        df["Momentum"] = df["close"] - df["close"].shift(10)
        df = df.dropna()
    else:
        print("Close column not found")
    return df

def scale_features(df, feature_columns):
    scaler = StandardScaler()
    df[feature_columns] = scaler.fit_transform(df[feature_columns])
    return df, scaler

def merge_data(stock_df, emotion_folder,save_path):
    
    if "time" not in stock_df.columns:
        print("Missing time column, can't merge data")
        return stock_df
    stock_df["date"] = pd.to_datetime(stock_df["time"])
    for col in ["natural", "positive", "negative"]:
        if col not in stock_df.columns:
            stock_df[col] = 0

    # merged_data["natural"] = 0
    # merged_data["positive"] = 0
    # merged_data["negative"] = 0
    stock_df.to_csv(save_path, index=False)
    # for month_year in stock_df["month_year"].unique():
    #     emotion_file = os.path.join(emotion_folder, f"{month_year}.csv")

    #     if os.path.exists(emotion_file):
    #         print(f"Merge {emotion_file}...")
    #         emotion_df = pd.read_csv(emotion_file)

    #         emotion_df.columns = emotion_df.columns.str.strip()  
    #         required_cols = ["time", "natural", "positive", "negative"]

    #         if all(col in emotion_df.columns for col in required_cols):
    #             emotion_df["date"] = pd.to_datetime(emotion_df["time"])
    #             emotion_df.drop(columns=["time"], inplace=True)

    #             merged_data = merged_data.merge(emotion_df, on="date", how="left")
    #         else:
    #             print(f"Emotions data {emotion_file} missing column {required_cols}!")

    # merged_data[["natural", "positive", "negative"]] = merged_data[["natural", "positive", "negative"]].fillna(0)
    # merged_data.to_csv(save_path, index=False)
    print(f"Merged emotions and stock data, size: {stock_df.shape}")
    return stock_df
def process_data(file_path,emotion_path,save_path):
    df = load_data(file_path=file_path)
    df = clean_data(df)
    df = create_features(df)
    df, scaler = scale_features(df, ["Return", "Volatility", "Momentum"])
    merged_df = merge_data(df, emotion_path,save_path=save_path)