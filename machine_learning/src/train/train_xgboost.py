import os
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

def train_xgboost_for_stock(stock_code, file_path, model_dir, output_dir):
    print(f"Loading data of training for {stock_code}...")

    df = pd.read_csv(file_path)

    if df.empty:
        print(f"Not found data {stock_code}!")
        return None, None

    features = ["high", "low", "close", "volume", "Volatility", "Momentum", "Return", "natural", "positive", "negative"]
    target = "open"

    df = df.dropna(subset=features + [target])

    X = df[features]
    y = df[target].shift(-1).dropna() 
    X = X.iloc[:-1] 

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, shuffle=False)

    print(f" {stock_code} - Train: {X_train.shape[0]} case, Test: {X_test.shape[0]} case")

    model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=100, learning_rate=0.05)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred)
    print(f" {stock_code} - RMSE : {rmse:.4f}")

    model_path = os.path.join(model_dir, f"xgboost_model_{stock_code}.pkl")
    joblib.dump(model, model_path)
    print(f" Models XGBoost {stock_code} saved at {model_path}")

    y_pred_all = model.predict(X)
    df = df.iloc[:-1]  
    df["xgb_prediction"] = y_pred_all
    df["xgb_prediction"] = y_pred_all
    output_path = os.path.join(output_dir, f"{stock_code}_xgb_predictions.csv")
    df.to_csv(output_path, index=False)
    print(f"XGBoost prediction for {stock_code} saved at {output_path}")

    return model, rmse

def train_xgboost_from_stock(stock_code, model_dir, output_dir):
    print(f"Loading data of training for {stock_code}...")
    data_stock_path = f"./data/processed/{stock_code}_merged.csv"
    df = pd.read_csv(data_stock_path)

    if df.empty:
        print(f"Not found data {stock_code}!")
        return None, None

    features = ["high", "low", "close", "volume", "Volatility", "Momentum", "Return", "natural", "positive", "negative"]
    target = "open"

    df = df.dropna(subset=features + [target])

    X = df[features]
    y = df[target].shift(-1).dropna()  
    X = X.iloc[:-1]  

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, shuffle=False)

    print(f" {stock_code} - Train: {X_train.shape[0]} case, Test: {X_test.shape[0]} case")

    model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=100, learning_rate=0.05)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred)
    print(f" {stock_code} - RMSE : {rmse:.4f}")

    model_path = os.path.join(model_dir, f"xgboost_model_{stock_code}.pkl")
    joblib.dump(model, model_path)
    print(f"Saved Models XGBoost {stock_code} at {model_path}")

    y_pred_all = model.predict(X)
    df = df.iloc[:-1]  
    df["xgb_prediction"] = y_pred_all
    df["xgb_prediction"] = y_pred_all
    output_path = os.path.join(output_dir, f"{stock_code}_xgb_predictions.csv")
    df.to_csv(output_path, index=False)
    print(f"Save dXGBoost prediction for {stock_code} at {output_path}")

    return model

def train_xgboost_all(processed_data_dir, model_dir, output_dir):
    
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for file in os.listdir(processed_data_dir):
        if file.endswith("_merged.csv"):
            stock_code = file.split("_")[0] 
            file_path = os.path.join(processed_data_dir, file)
            m,r = train_xgboost_for_stock(stock_code, file_path, model_dir, output_dir)

if __name__ == "__main__":
    processed_data_dir = "./data/processed"
    model_dir = "./models"
    output_dir = "./data/xgb_predictions"

    train_xgboost_all(processed_data_dir, model_dir, output_dir)
