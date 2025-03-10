import os
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

def train_meta_model(stock_code, meta_data_file, meta_model_dir):
    print(f"Loading data of Meta Model for {stock_code}...")

    df_meta = pd.read_csv(meta_data_file)

    if df_meta.empty:
        print(f"Not found data of training for Meta Model {stock_code}.")
        return

    required_columns = ["xgb_prediction", "lstm_prediction", "open"]
    if not all(col in df_meta.columns for col in required_columns):
        print(f"missing necessary columns from {meta_data_file}.Skip!")
        return

    X = df_meta[["xgb_prediction", "lstm_prediction"]].values
    y = df_meta["open"].values  
    train_size = int(len(X) * 0.9)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    print(f" {stock_code} - Train: {len(X_train)} case, Test: {len(X_test)} case")

    meta_model = LinearRegression()
    meta_model.fit(X_train, y_train)

    y_pred = meta_model.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred)
    print(f"{stock_code} - RMSE : {rmse:.4f}")

    if not os.path.exists(meta_model_dir):
        os.makedirs(meta_model_dir)

    model_path = os.path.join(meta_model_dir, f"meta_model_{stock_code}.pkl")
    joblib.dump(meta_model, model_path)
    print(f"Meta Model of {stock_code} saved at {model_path}")

    return meta_model
def train_meta_model_for_code(stock_code, meta_model_dir):
    print(f"Loading data of Meta Model for {stock_code}...")
    meta_data_path = f"./data/meta_data/{stock_code}_meta_data.csv"
    df_meta = pd.read_csv(meta_data_path)

    if df_meta.empty:
        print(f"Not found data of training for Meta Model {stock_code}.")
        return

    required_columns = ["xgb_prediction", "lstm_prediction", "open"]
    if not all(col in df_meta.columns for col in required_columns):
        print(f"Missing necessary columns from {meta_data_path}. Skip!")
        return

    X = df_meta[["xgb_prediction", "lstm_prediction"]].values
    y = df_meta["open"].values  

    train_size = int(len(X) * 0.9)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    print(f" {stock_code} - Train: {len(X_train)} case, Test: {len(X_test)} case")

    meta_model = LinearRegression()
    meta_model.fit(X_train, y_train)

    y_pred = meta_model.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred)
    print(f" {stock_code} - RMSE : {rmse:.4f}")

    if not os.path.exists(meta_model_dir):
        os.makedirs(meta_model_dir)

    model_path = os.path.join(meta_model_dir, f"meta_model_{stock_code}.pkl")
    joblib.dump(meta_model, model_path)
    print(f"Saved Meta Model of {stock_code} at {model_path}")

    return meta_model
def train_all_meta_models(meta_data_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for file in os.listdir(meta_data_dir):
        if file.endswith("_meta_data.csv"):
            stock_code = file.split("_")[0] 
            meta_data_file = os.path.join(meta_data_dir, file)

            train_meta_model(stock_code, meta_data_file, output_dir)

if __name__ == "__main__":
    meta_data_dir = "./data/meta_data"
    meta_model_dir = "./models/meta_models"

    train_all_meta_models(meta_data_dir, meta_model_dir)
