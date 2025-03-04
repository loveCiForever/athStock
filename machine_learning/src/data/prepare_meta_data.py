import os
import pandas as pd

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
    df = pd.read_csv(f"./data/lstm_predictions/{stock_code}_lstm_predictions.csv")
            
    required_columns = ["time", "open", "xgb_prediction", "lstm_prediction"]
    if not all(col in df.columns for col in required_columns):
        print(f"{stock_code}: Missing column, skip!")

    meta_data = df[required_columns]

    output_file = os.path.join(output_dir, f"{stock_code}_meta_data.csv")
    meta_data.to_csv(output_file, index=False)
    print(f"✅ {stock_code}:Saved data at{output_file}")


if __name__ == "__main__":
    lstm_predictions_dir = "./data/lstm_predictions"
    output_dir = "./data/meta_data"

    prepare_meta_data_all(lstm_predictions_dir, output_dir)
