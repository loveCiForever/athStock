import os
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt

def load_latest_data(meta_data_file, num_days=50):
    if not os.path.exists(meta_data_file):
        print("Not found data")
        return None

    df = pd.read_csv(meta_data_file)

    if df.empty or len(df) < num_days:
        print("not enough data")
        return None

    df = df.sort_values("time").tail(num_days).reset_index(drop=True)

    return df

def predict_next_day(meta_model, latest_data):
    latest_features = latest_data[["xgb_prediction", "lstm_prediction"]].values
    predicted_open = meta_model.predict(latest_features)

    last_date = pd.to_datetime(latest_data["time"].iloc[-1])
    next_day = last_date + pd.Timedelta(days=1)
    next_day_str = next_day.strftime("%Y-%m-%d")

    return next_day_str, predicted_open[-1]

def visualize_predictions(latest_data, predicted_date, predicted_price, save_path="meta_prediction22.png"):
    
    plt.figure(figsize=(12, 6))

    plt.plot(latest_data["time"], latest_data["open"], label="Giá mở cửa thực tế", marker="o", color="blue")

    plt.scatter([predicted_date], [predicted_price], color="red", label="Dự đoán ngày mai", marker="x", s=100)

    plt.xlabel("Ngày")
    plt.ylabel("Giá mở cửa")
    plt.title("Dự đoán giá mở cửa ngày mai với Meta Model (50 ngày gần nhất)")
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid()

    plt.savefig(save_path)
    print(f" Biểu đồ đã được lưu tại {save_path}")

    # Hiển thị ảnh trên Google Colab

def test_meta_model(meta_model_file, meta_data_file, num_days=50):
    """
    Chạy kiểm tra Meta Model để dự đoán giá mở cửa ngày mai.
    """
    if not os.path.exists(meta_model_file):
        print("⚠️ Không tìm thấy mô hình Meta Model, hãy huấn luyện bằng train_meta.py!")
        return

    # Tải mô hình Meta
    meta_model = joblib.load(meta_model_file)

    # Lấy dữ liệu thực tế gần nhất
    latest_data = load_latest_data(meta_data_file, num_days)
    if latest_data is None:
        return

    # Dự đoán giá mở cửa ngày mai
    predicted_date, predicted_price = predict_next_day(meta_model, latest_data)
 
    # Hiển thị kết quả
    print("📊 **Dữ liệu thực tế 50 ngày gần nhất:**")
    print(latest_data[["time", "open"]])
    print(f"\n📅 **Ngày dự đoán:** {predicted_date}")
    print(f"💰 **Giá mở cửa dự đoán:** {predicted_price:.2f}")

    # Vẽ biểu đồ
    visualize_predictions(latest_data, predicted_date, predicted_price)

if __name__ == "__main__":
    meta_model_file = "./models/meta_models/meta_model_VCB.pkl"
    meta_data_file = "./data/meta_data/VCB_meta_data.csv"

    test_meta_model(meta_model_file, meta_data_file)
