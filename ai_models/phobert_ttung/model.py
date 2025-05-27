import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import joblib
import numpy as np

class PhoBERTClassifier:
    def __init__(self, model_path="phobert"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path).to(self.device)
        self.label_encoder = joblib.load("label_encoder.pkl")

    def predict(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=256).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=1).cpu().item()
        return self.label_encoder.inverse_transform([prediction])[0]
