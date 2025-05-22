
# Vietnamese Stock News Analysis Model

This project uses a fine-tuned [PhoBERT](https://huggingface.co/vinai/phobert-base) model to predict stock trend directions (INCREASING, DECREASING, UNCHANGED) based on Vietnamese news articles.

---

## 📁 Project Structure

```
news_analysis_model/
│
data
└── NewsData.csv                 #Data
│
├── data_preprocessing.py     # Extract and clean Vietnamese news from URLs
├── model.py                  # Load and run inference with the fine-tuned PhoBERT model
├── predict.py                # Use model to predict trends from input URLs
├── phobert.py       # Script to fine-tune PhoBERT using labeled data
├── utils.py                  # Helper functions
├── NewsData.csv              # Your dataset (URL, label, impact, text, etc.)
└── README.md                 # This file
```

---

## 🔧 Requirements

Install required packages:

```bash
pip install -r requirements.txt
```

Typical requirements include:
- torch
- transformers
- pandas
- scikit-learn
- beautifulsoup4
- requests
- joblib

---

## 🔍 Fine-Tuning

To fine-tune PhoBERT on your labeled dataset:

```bash
python finetune_phobert.py
```

- Input: `NewsData.csv` with `text` and `label` columns
- Output: Fine-tuned model saved to `finetuned_phobert/`

---

## 🔮 Inference

Use the fine-tuned model in `model.py`:

```python
from model import PhoBERTClassifier
classifier = PhoBERTClassifier()
trend = classifier.predict("Vietnamese news article text here")
print(trend)
```

---

## 🌐 End-to-End Prediction

```bash
python predict.py "https://example.com/news-article"
```

- Automatically scrapes, cleans, tokenizes the article
- Returns predicted trend and stock codes mentioned

---

## 📦 Export to ONNX (Optional)

For deployment:

```bash
python -m transformers.onnx --model=finetuned_phobert onnx_model/
```

---

## 🧠 Model Info

- Base model: `vinai/phobert-base`
- Fine-tuned for classification (3 classes)
- Task: Vietnamese financial news → Trend prediction

---

## 📝 License

Open-source for educational/research use.
