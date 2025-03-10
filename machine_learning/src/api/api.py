import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

# Khởi tạo FastAPI
app = FastAPI()

# Định nghĩa thư mục chứa mô hình
MODEL_DIR = "./models"

# Định nghĩa danh sách các cột đầu vào
FEATURES = ["high", "low", "close", "volume", "Volatility", "Momentum", "Return", "natural", "positive", "negative"]

# Định nghĩa class cho request đầu vào
class StockPredictionRequest(BaseModel):
    stock_code: str
    high: float
    low: float
    close: float
    volume: int
    Volatility: float
    Momentum: float
    Return: float
    natural: float
    positive: float
    negative: float

@app.get("/")
def home():
    return {"message": "Stock Prediction API is running!"}

@app.post("/predict/")
def predict_stock_price(request: StockPredictionRequest):
    """
    API nhận thông tin dữ liệu và trả về dự đoán giá mở cửa ngày mai.
    """
    model_path = os.path.join(MODEL_DIR, f"xgboost_model_{request.stock_code}.pkl")

    # Kiểm tra nếu mô hình tồn tại
    if not os.path.exists(model_path):
        return {"error": f"Mô hình cho {request.stock_code} chưa được huấn luyện!"}

    # Tải mô hình
    model = joblib.load(model_path)

    # Chuẩn bị dữ liệu đầu vào
    input_data = pd.DataFrame([[
        request.high, request.low, request.close, request.volume, 
        request.Volatility, request.Momentum, request.Return, 
        request.natural, request.positive, request.negative
    ]], columns=FEATURES)

    # Dự đoán
    predicted_open = model.predict(input_data)[0]

    return {
        "stock_code": request.stock_code,
        "predicted_open_price": round(predicted_open, 2)
    }
