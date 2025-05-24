import pandas as pd
from sklearn.model_selection import train_test_split
from src.utils.data import clean_text

class DataTrainer:
    def __init__(self, data_path, text_col='text', label_col='label', date_col=None, test_size=0.2, random_state=42):
        self.data_path = data_path
        self.text_col = text_col
        self.label_col = label_col
        self.date_col = date_col
        self.test_size = test_size
        self.random_state = random_state
        self.label_map = {'neutral': 0, 'positive': 1, 'negative': 2}

    def load_data(self):
        df = pd.read_csv(self.data_path)
        return df

    def preprocess(self, df):
        if self.text_col in df.columns:
            df[self.text_col] = df[self.text_col].astype(str).apply(clean_text)
        if self.date_col and self.date_col in df.columns:
            df[self.date_col] = pd.to_datetime(df[self.date_col], errors='coerce')
        if self.date_col and self.date_col in df.columns:
            df = df.dropna(subset=[self.text_col, self.date_col])
        else:
            df = df.dropna(subset=[self.text_col])
        return df

    def label(self, df):
        if self.label_col in df.columns:
            df[self.label_col] = df[self.label_col].map(self.label_map)
        return df

    def split_data(self, df):
        X = df[self.text_col]
        y = df[self.label_col]
        return train_test_split(X, y, test_size=self.test_size, random_state=self.random_state)

    def prepare_data(self):
        df = self.load_data()
        df = self.preprocess(df)
        df = self.label(df)
        X_train, X_test, y_train, y_test = self.split_data(df)
        return X_train, X_test, y_train, y_test 