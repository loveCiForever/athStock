import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

def clean_dataset(df):
    df = df.applymap(lambda x: x.strip().replace('"', '') if isinstance(x, str) else x)
    df = df.dropna(subset=["link", "stock", "label", "impact"])
    return df

def load_and_encode_labels(df, label_column="label"):
    label_encoder = LabelEncoder()
    df[label_column] = label_encoder.fit_transform(df[label_column])
    joblib.dump(label_encoder, "label_encoder.pkl")
    return df, label_encoder

def load_dataset(path="NewsData.csv"):
    df = pd.read_csv(path, header=None, names=["link", "stock", "label", "impact"], sep=",\s*", engine="python")
    return clean_dataset(df)
