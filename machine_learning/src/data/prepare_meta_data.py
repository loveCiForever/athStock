import os
import pandas as pd


def adjust_lstm_predictions(stock_code, raw_data_dir, lstm_predictions_dir):
    raw_file = os.path.join(raw_data_dir, f"{stock_code}_merged.csv")
    lstm_file = os.path.join(lstm_predictions_dir, f"{stock_code}_lstm_predictions.csv")
    
    if not os.path.exists(raw_file) or not os.path.exists(lstm_file):
        print(f"{stock_code}: Missing raw or lstm prediction file, skipping!")
        return
    
    df_raw = pd.read_csv(raw_file)
    df_lstm = pd.read_csv(lstm_file)
    
    # Đảm bảo cột 'time' ở dạng datetime để dễ dàng ghép nối
    df_raw["time"] = pd.to_datetime(df_raw["time"])
    df_lstm["time"] = pd.to_datetime(df_lstm["time"])
    
    # Ghép dữ liệu dựa trên cột time, giữ nguyên các cột của raw
    df_merged = df_raw.merge(df_lstm[["time", "lstm_prediction"]], on="time", how="left")
    
    # Nếu thiếu giá trị lstm_prediction, điền bằng xgb_prediction hoặc NaN
    df_merged["lstm_prediction"].fillna(df_merged["xgb_prediction"], inplace=True)
    
    # Đảm bảo dữ liệu không bị lệch hàng do cắt time_steps
    if len(df_merged) > len(df_raw):
        df_merged = df_merged.iloc[-len(df_raw):]  # Giữ lại đúng số dòng như raw
    
    df_merged.to_csv(lstm_file, index=False)
    print(f"{stock_code}: Adjusted LSTM predictions to match raw data length!")

def prepare_meta_data_all(lstm_predictions_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for file in os.listdir(lstm_predictions_dir):
        if file.endswith("_lstm_predictions.csv"):
            stock_code = file.split("_")[0]  
            file_path = os.path.join(lstm_predictions_dir, file)
            
            df = pd.read_csv(file_path)
            
            required_columns = ["time", "open", "xgb_prediction", "lstm_prediction"]
            if not all(col in df.columns for col in required_columns):
                print(f"{stock_code}: Missing column, skip!")
                continue

            meta_data = df[required_columns]

            output_file = os.path.join(output_dir, f"{stock_code}_meta_data.csv")
            meta_data.to_csv(output_file, index=False)
            print(f"{stock_code}: Saved data at {output_file}")
def prepare_meta_data_for_stock(stock_code, output_dir):
    raw_data = f"./data/raw/{stock_code}.csv"
    adjust_lstm_predictions(stock_code, raw_data, output_dir)
    df = pd.read_csv(f"./data/lstm_predictions/{stock_code}_lstm_predictions.csv")
    required_columns = ["time", "open", "xgb_prediction", "lstm_prediction"]
    if not all(col in df.columns for col in required_columns):
        print(f"{stock_code}: Missing column, skip!")

    meta_data = df[required_columns]

    output_file = os.path.join(output_dir, f"{stock_code}_meta_data.csv")
    meta_data.to_csv(output_file, index=False)
    print(f"{stock_code}:Saved data at{output_file}")


if __name__ == "__main__":
    lstm_predictions_dir = "./data/lstm_predictions"
    output_dir = "./data/meta_data"

    prepare_meta_data_all(lstm_predictions_dir, output_dir)
