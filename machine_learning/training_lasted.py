import os
from src.data.fetch_data import fetch_data
from src.data.data_processing import  process_data
from src.train.train_xgboost import train_xgboost_from_stock
from src.train.train_lstm import train_lstm_for_stock
from src.train.train_meta import train_meta_model_for_code
from src.data.prepare_meta_data import prepare_meta_data_for_stock
from src.test.test_meta import *
import sys
base_Dir = "."

def main(stock_code,end_date):
    paths_to_clear = [
    f"./models/xgboost_model_{stock_code}.pkl",
    f"./models/lstm_model_{stock_code}.h5",
    f"./models/meta_models/meta_model_{stock_code}.pkl",
    f"./data/xgb_predictions/{stock_code}_xgb_predictions.csv",
    f"./data/lstm_predictions/{stock_code}_lstm_predictions.csv",
    f"./data/meta_data/{stock_code}_meta_data.csv",
    f"./data/processed/{stock_code}_merged.csv",
    f"./data/raw/{stock_code}.csv"
    ]

    for file_path in paths_to_clear:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Delete: {file_path}")
        else:
            print(f"Not found file: {file_path}")

    start_date = "2010-01-01"
    raw_path = f"./data/raw/{stock_code}.csv"
    emotion_path = "./data/emotions/"
    xgb_ouput = "./data/xgb_predictions/"
    lstm_ouput = "./data/lstm_predictions/"
    meta_data_path = "./data/meta_data/"
    models_dir = "./models"
    meta_models_dir = "./models/meta_models"
    meta_data_file = f"./data/meta_data/{stock_code}_meta_data.csv"

    process_file_path = f"./data/processed/{stock_code}_merged.csv"
    df = fetch_data(stock_code=stock_code,start_date=start_date,end_date=end_date,save_path=raw_path)
    meta_models_file = f"./models/meta_models/meta_model_{stock_code}.pkl"
    df = process_data(raw_path,emotion_path=emotion_path,save_path=process_file_path)
    xgb = train_xgboost_from_stock(stock_code=stock_code,model_dir=models_dir,output_dir=xgb_ouput)
    lstm = train_lstm_for_stock(stock_code=stock_code,model_dir=models_dir,xgb_output_dir=xgb_ouput,lstm_output_dir=lstm_ouput)
    meta_data = prepare_meta_data_for_stock(stock_code=stock_code,output_dir=meta_data_path)
    meta = train_meta_model_for_code(stock_code=stock_code,meta_model_dir=meta_models_dir)
    a,b = test_meta_model(meta_model_file=meta_models_file,meta_data_file=meta_data_file)
if __name__ == "__main__":
    if len(sys.argv) >1:
        main(stock_code=sys.argv[1],end_date=sys.argv[2])
    else:
        print("pls input stock code")
