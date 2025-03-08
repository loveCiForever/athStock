from training_lasted import main
import pandas as pd
from src.test.test_meta import test_meta_model
from datetime import datetime

def update_raw_file(raw_file, predicted_date, predicted_price):
    df = pd.read_csv(raw_file)

    last_row = df.iloc[-1].copy()
    last_row["time"] = predicted_date  
    last_row["open"] = predicted_price  

    df = pd.concat([df, pd.DataFrame([last_row])], ignore_index=True)

    df.to_csv(raw_file, index=False)

def predict(stock_code,ouputfile):
    main(stock_code=stock_code)
    data_raw = f"./data/raw/{stock_code}.csv"
    data_real_future = "./data/real_future_data.csv"
    data_future = pd.read_csv(data_real_future)
    time_column = data_future['time'].tolist()
    open_column = data_future['open'].tolist()
    # while time_column:
    meta_model_file=f"./models/meta_models/meta_model_{stock_code}.pkl"
    meta_data_file=f"./data/meta_data/{stock_code}_meta_data.csv"
    predicted_date, predicted_price = test_meta_model(meta_model_file=meta_model_file,meta_data_file=meta_data_file)

    predicted_date_dt = datetime.strptime(predicted_date, "%Y-%m-%d")
    first_time_dt = datetime.strptime(time_column[0], "%Y-%m-%d")

    if predicted_date_dt < first_time_dt:
        update_raw_file(data_raw, predicted_date, predicted_price)
    elif predicted_date_dt == first_time_dt:
        actual_open = open_column[0]
        with open(ouputfile, "a") as f:
            f.write(f"{predicted_date},{actual_open},{predicted_price}\n")
    else:
        time_column.pop(0)
        open_column.pop(0)
        # if not time_column:
        #     break
    main(stock_code=stock_code)

if __name__ == "__main__":
    predict("VCB","./data/prediction.csv")