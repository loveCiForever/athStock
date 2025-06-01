import pandas as pd
import torch
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from torch.utils.data import Dataset, DataLoader
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
import numpy as np
import joblib
import argparse
import os

def parse_args():
    parser = argparse.ArgumentParser(description="Fine-tune PhoBERT for stock news analysis")
    parser.add_argument("--data_path", default="data/NewsData.csv", help="Path to dataset CSV")
    parser.add_argument("--model_path", default="finetuned_phobert", help="Path to save fine-tuned model")
    parser.add_argument("--learning_rate", type=float, default=2e-5, help="Learning rate")
    parser.add_argument("--batch_size", type=int, default=8, help="Batch size for training and evaluation")
    parser.add_argument("--num_epochs", type=int, default=5, help="Number of training epochs")
    return parser.parse_args()

# Parse arguments
args = parse_args()

# Load dataset with error handling
try:
    if not os.path.exists(args.data_path):
        raise FileNotFoundError(f"Dataset file {args.data_path} not found")
    df = pd.read_csv(args.data_path, names=["link", "stock", "label", "impact"], sep=",\s*", engine="python")
    df = df.dropna(subset=["label", "impact"])
    texts = df["impact"].tolist()  # Use 'impact' column as text
    labels = df["label"].tolist()
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit(1)

# Encode labels
le = LabelEncoder()
labels_encoded = le.fit_transform(labels)
joblib.dump(le, os.path.join(args.model_path, "label_encoder.pkl"))

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

# Split dataset into train and validation
train_texts, val_texts, train_labels, val_labels = train_test_split(
    texts, labels_encoded, test_size=0.2, random_state=42
)
train_dataset = NewsDataset(train_texts, train_labels)
val_dataset = NewsDataset(val_texts, val_labels)

# Load model
model = AutoModelForSequenceClassification.from_pretrained("vinai/phobert-base", num_labels=len(le.classes_))

# Trainer
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    num_train_epochs=args.num_epochs,
    per_device_train_batch_size=args.batch_size,
    per_device_eval_batch_size=args.batch_size,
    learning_rate=args.learning_rate,
    logging_dir='./logs',
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

try:
    trainer.train()
except Exception as e:
    print(f"Error during training: {e}")
    exit(1)

# Save model
try:
    os.makedirs(args.model_path, exist_ok=True)
    trainer.save_model(args.model_path)
    tokenizer.save_pretrained(args.model_path)
    print(f"Model and tokenizer saved to {args.model_path}")
except Exception as e:
    print(f"Error saving model: {e}")
    exit(1)