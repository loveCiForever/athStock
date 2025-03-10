import os
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

def prepare_data_lstm(df, features, target, time_steps=10):
    scaler = MinMaxScaler()
    df[features] = scaler.fit_transform(df[features])

    X, y = [], []
    for i in range(len(df) - time_steps):
        X.append(df[features].iloc[i:i+time_steps].values)
        y.append(df[target].iloc[i+time_steps])

    return np.array(X), np.array(y), scaler

def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(128, return_sequences=True, input_shape=input_shape),
        Dropout(0.3),
        LSTM(128, return_sequences=False),
        Dropout(0.3),
        Dense(32),
        Dense(1)
    ])
    
    model.compile(optimizer="adam", loss="mean_squared_error")
    return model

def train_lstm_for_stock(stock_code, model_dir, xgb_output_dir, lstm_output_dir):
    print(f"Loading Data for {stock_code}...")
    data_stock_path = f"./data/processed/{stock_code}_merged.csv"

    df = pd.read_csv(data_stock_path)

    if df.empty:
        print(f"Data not found for train {stock_code}!")
        return None, None

    xgb_pred_file = os.path.join(xgb_output_dir, f"{stock_code}_xgb_predictions.csv")
    
    if not os.path.exists(xgb_pred_file):
        print(f" Not found data of XGBoost for {stock_code}, skip training LSTM.")
        return None, None

    df_xgb = pd.read_csv(xgb_pred_file)
    df = df_xgb  

    features = ["high", "low", "close", "volume", "Volatility", "Momentum", "Return", "natural", "positive", "negative", "xgb_prediction"]
    target = "open"

    df = df.dropna(subset=features + [target])

    time_steps = 10
    X, y, scaler = prepare_data_lstm(df, features, target, time_steps)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, shuffle=False)

    print(f"{stock_code} - Train: {X_train.shape[0]} case, Test: {X_test.shape[0]} case")

    model = build_lstm_model((time_steps, len(features)))
    model.fit(X_train, y_train, epochs=50, batch_size=64, validation_data=(X_test, y_test))

    model_path = os.path.join(model_dir, f"lstm_model_{stock_code}.h5")
    model.save(model_path)
    print(f"Saved Model {stock_code} at {model_path}")

    y_pred_all = model.predict(X)
    df_lstm = df_xgb.copy()
    df_lstm["lstm_prediction"] = np.nan
    df_lstm.iloc[time_steps:, df_lstm.columns.get_loc("lstm_prediction")] = y_pred_all.flatten()
    
    # Thay thế NaN bằng xgb_prediction để tránh lỗi NaN trong meta model
    df_lstm["lstm_prediction"].fillna(df_lstm["xgb_prediction"], inplace=True)
    
    output_path = os.path.join(lstm_output_dir, f"{stock_code}_lstm_predictions.csv")
    df_lstm.to_csv(output_path, index=False)
    print(f"Saved LSTM predictions {stock_code} at {output_path}")

    return model

def train_lstm(processed_data_dir, model_dir, xgb_output_dir, lstm_output_dir):
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    if not os.path.exists(lstm_output_dir):
        os.makedirs(lstm_output_dir)

    for file in os.listdir(processed_data_dir):
        if file.endswith("_merged.csv"):
            stock_code = file.split("_")[0]
            file_path = os.path.join(processed_data_dir, file)
            train_lstm_for_stock(stock_code, file_path, model_dir, xgb_output_dir, lstm_output_dir)

if __name__ == "__main__":
    processed_data_dir = "./data/processed"
    model_dir = "./models"
    xgb_output_dir = "./data/xgb_predictions"  
    lstm_output_dir = "./data/lstm_predictions"

    train_lstm(processed_data_dir, model_dir, xgb_output_dir, lstm_output_dir)
