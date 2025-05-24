from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

class ModelTrainer:
    def __init__(self, max_features=5000, ngram_range=(1,2), min_df=2, max_df=0.95, random_state=42):
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(
                max_features=max_features,
                ngram_range=ngram_range,
                min_df=min_df,
                max_df=max_df
            )),
            ('clf', LogisticRegression(solver='liblinear', random_state=random_state))
        ])

    def train(self, X_train, y_train):
        self.pipeline.fit(X_train, y_train)
        return self.pipeline

    def save(self, path):
        with open(path, 'wb') as f:
            pickle.dump(self.pipeline, f) 