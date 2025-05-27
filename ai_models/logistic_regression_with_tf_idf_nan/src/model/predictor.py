import pickle
import numpy as np

class Predictor:
    def __init__(self, model_path):
        with open(model_path, 'rb') as f:
            self.pipeline = pickle.load(f)
        self.label_map = {0: 'neutral', 1: 'positive', 2: 'negative'}

    def predict(self, text):
        proba = None
        pred = None
        if hasattr(self.pipeline.named_steps['clf'], 'predict_proba'):
            proba = self.pipeline.predict_proba([text])[0]
            idx = int(np.argmax(proba))
            pred = idx
        else:
            pred = self.pipeline.predict([text])[0]
        label_name = self.label_map.get(pred, str(pred))
        max_proba = float(proba[pred]) if proba is not None else None
        return label_name, max_proba, proba 