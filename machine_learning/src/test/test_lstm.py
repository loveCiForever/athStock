import os
import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
MODEL_DIR = "./models"
DATA_DIR = "./data/processed"

FEATURES = ["high", "low", "close", "volume", "Volatility", "Momentum", "Return", "natural", "positive", "negative"]

def load_test_data(stock_code):
    file_path = os.path.join(DATA_DIR, f"{stock_code}_merged.csv")
    if not os.path.exists(file_path):
        print(f"Not found data  {file_path}")
        return None, None
    
    df = pd.read_csv(file_path).dropna(subset=FEATURES + ["open"])
    
    scaler = MinMaxScaler()
    df[FEATURES] = scaler.fit_transform(df[FEATURES])

    X_test, y_test = [], []
    time_steps = 10  
    for i in range(len(df) - time_steps):
        X_test.append(df[FEATURES].iloc[i:i+time_steps].values)
        y_test.append(df["open"].iloc[i+time_steps])
    
    return np.array(X_test), np.array(y_test), scaler

def test_lstm(stock_code):
    print(f"test model {stock_code}...")

    model_path = os.path.join(MODEL_DIR, f"lstm_model_{stock_code}.h5")
    if not os.path.exists(model_path):
        print(f"not found model {stock_code} ")
        return
    
    model = tf.keras.models.load_model(model_path)

    X_test, y_test, scaler = load_test_data(stock_code)
    if X_test is None:
        return
    y_pred = model.predict(X_test)
    y_pred = y_pred.reshape(-1)

    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f"✅ {stock_code} - RMSE: {rmse:.4f}")
    plt.figure(figsize=(10, 5))
    plt.plot(y_test, label="Giá mở cửa thực tế", color="blue")
    plt.plot(y_pred, label="Giá mở cửa dự đoán", color="red")
    plt.xlabel("Ngày")
    plt.ylabel("Giá mở cửa")
    plt.title(f"So sánh giá mở cửa thực tế vs dự đoán - {stock_code}")
    plt.legend()
    plt.grid(True)
    plt.savefig("prediction_chart.png")

if __name__ == "__main__":
    test_lstm("VCB")  
