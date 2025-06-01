import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import joblib
import numpy as np
import os

class PhoBERTClassifier:
    def __init__(self, model_path="finetuned_phobert", max_length=256):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = model_path
        self.max_length = max_length
        # Check if model and label encoder exist
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model directory {model_path} not found")
        if not os.path.exists(os.path.join(model_path, "label_encoder.pkl")):
            raise FileNotFoundError(f"Label encoder file not found in {model_path}")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_path).to(self.device)
            self.label_encoder = joblib.load(os.path.join(model_path, "label_encoder.pkl"))
        except Exception as e:
            raise RuntimeError(f"Error loading model or tokenizer: {e}")

    def predict(self, texts):
        if not texts:
            raise ValueError("Input texts cannot be empty")
        if isinstance(texts, str):
            texts = [texts]  # Convert single string to list for batch processing
        if not all(isinstance(t, str) for t in texts):
            raise ValueError("All inputs must be strings")
        
        inputs = self.tokenizer(texts, return_tensors="pt", truncation=True, padding=True, max_length=self.max_length).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
        logits = outputs.logits
        predictions = torch.argmax(logits, dim=1).cpu().numpy()
        return self.label_encoder.inverse_transform(predictions).tolist()