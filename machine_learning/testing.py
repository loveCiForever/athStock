import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
def plot_stock_comparison(csv_file):
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv(csv_file, parse_dates=['time'])
    
    # Sắp xếp dữ liệu theo thời gian
    df.sort_values('time', inplace=True)
    
    # Tính RMSE (Root Mean Squared Error)
    rmse = np.sqrt(np.mean((df['open'] - df['model']) ** 2))
    
    # Tính độ chính xác (Accuracy) dựa trên sai số trung bình
    accuracy = (1 - (rmse / np.mean(df['open']))) * 100
    
    # Vẽ biểu đồ
    plt.figure(figsize=(12, 6))
    plt.plot(df['time'], df['open'], marker='o', linestyle='-', label='Open Price', color='blue')
    plt.plot(df['time'], df['model'], marker='s', linestyle='--', label='Model Prediction', color='red')
    
    # Định dạng biểu đồ
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.title(f'Stock Open Price vs Model Prediction (RMSE: {rmse:.4f}, Accuracy: {accuracy:.2f}%)')
    
    # Hiển thị tất cả các ngày trên trục x
    plt.xticks(df['time'], rotation=45)
    plt.gca().xaxis.set_major_locator(mdates.DayLocator())
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
    
    plt.legend()
    plt.grid()
    
    # Hiển thị biểu đồ
    plt.show()

file_path = "./data/real_future_data.csv"
plot_stock_comparison(file_path)