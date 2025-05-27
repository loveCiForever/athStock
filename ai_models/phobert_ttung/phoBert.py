import pandas as pd
import torch
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import Dataset, DataLoader
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
import numpy as np
import joblib

# Load dataset
df = pd.read_csv("data/NewsData.csv", names=["link", "stock", "label", "impact"])
df = df.dropna(subset=["label"])
texts = df["text"].tolist()  # You must have a 'text' column with tokenized Vietnamese
labels = df["label"].tolist()

# Encode labels
le = LabelEncoder()
labels_encoded = le.fit_transform(labels)
joblib.dump(le, "label_encoder.pkl")

# Tokenizer and Dataset
tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")

class NewsDataset(Dataset):
    def __init__(self, texts, labels):
        self.encodings = tokenizer(texts, truncation=True, padding=True, max_length=256)
        self.labels = labels

    def __getitem__(self, idx):
        return {
            "input_ids": torch.tensor(self.encodings["input_ids"][idx]),
            "attention_mask": torch.tensor(self.encodings["attention_mask"][idx]),
            "labels": torch.tensor(self.labels[idx])
        }

    def __len__(self):
        return len(self.labels)

dataset = NewsDataset(texts, labels_encoded)

# Load model
model = AutoModelForSequenceClassification.from_pretrained("vinai/phobert-base", num_labels=len(le.classes_))

# Trainer
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    num_train_epochs=5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    learning_rate=2e-5,
    logging_dir='./logs',
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    eval_dataset=dataset,  # You can split into train/val sets
)

trainer.train()

# Save model
trainer.save_model("phobert")
tokenizer.save_pretrained("phobert")
