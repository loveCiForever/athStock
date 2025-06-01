# 📈 Vietnamese Stock News Analysis Model

Welcome to the **Vietnamese Stock News Analysis Model**! This project uses a fine-tuned [PhoBERT](https://huggingface.co/vinai/phobert-base) model to predict stock market trends (📈 INCREASING, 📉 DECREASING, ⚖️ UNCHANGED) based on Vietnamese news articles. It also identifies stock codes mentioned in articles, making it easier to track relevant companies. Whether you're a researcher, trader, or data enthusiast, this tool can help you analyze how news impacts stock movements in Vietnam.

---

## 🎯 What Does This Project Do?

- **Predict Stock Trends**: Analyzes Vietnamese news articles to forecast if a stock will go up, down, or stay the same.
- **Extract Stock Codes**: Identifies stock tickers (e.g., VNM for Vinamilk) mentioned in articles.
- **Easy to Use**: Offers a command-line interface (CLI) to input news article URLs and get instant predictions.

---

## 📁 Project Structure

Here’s how the project is organized:

```
news_analysis_model/
├── data/
│   └── NewsData.csv          # Dataset with news articles and labels
├── preprocessing.py          # Scrapes news articles and extracts stock codes
├── model.py                  # Loads the PhoBERT model for predictions
├── cli.py                    # Command-line interface for predictions
├── phoBert.py                # Fine-tunes the PhoBERT model
├── utils.py                  # Helper functions for data processing
├── stock_mapping.py          # Extracts stock codes from text
├── requirements.txt          # List of required Python packages
└── README.md                 # You're reading this!
```

---

## 🚀 Getting Started

### 🔧 Step 1: Install Requirements

First, install the necessary Python packages. You’ll need Python 3.8 or higher.

```bash
pip install -r requirements.txt
```

Here are the key dependencies:
- `torch==2.0.0` & `transformers==4.30.0`: For the PhoBERT model
- `pandas==2.0.0` & `scikit-learn==1.2.2`: For data handling
- `beautifulsoup4==4.12.0` & `requests==2.28.0`: For web scraping
- `underthesea==1.3.5`: For Vietnamese text tokenization
- `vnstock==3.2.6` & `fuzzywuzzy[speedup]==0.18.0`: For stock code extraction
- `validators==0.20.0`, `langdetect==1.0.9`, `retrying==1.3.4`: For robust preprocessing

### 📊 Step 2: Prepare Your Dataset

You need a dataset (`NewsData.csv`) with the following columns:
- `link`: URL of the news article (optional for training)
- `stock`: Stock code (e.g., VNM)
- `label`: Trend label (INCREASING, DECREASING, UNCHANGED)
- `impact`: The news article text

Place this file in the `data/` folder. If you don’t have a dataset, you can still use the CLI to predict trends from new URLs.

### 🔍 Step 3: Fine-Tune the Model

Fine-tune the PhoBERT model on your dataset to improve its accuracy for your specific data.

```bash
python phoBert.py --data_path data/NewsData.csv --model_path finetuned_phobert
```

- **What Happens**: The script trains the model and saves it to the `finetuned_phobert/` folder.
- **Customization**: Adjust training settings with:
  - `--learning_rate` (default: 2e-5)
  - `--batch_size` (default: 8)
  - `--num_epochs` (default: 5)

### 🌐 Step 4: Make Predictions

Use the CLI to predict stock trends from news articles by providing URLs.

```bash
python cli.py --model_path finetuned_phobert --max_length 256 --stock_cache_path data/stock_cache.pkl --exchanges HOSE,HNX,UPCOM
```

- **How It Works**:
  1. Enter a news article URL (e.g., `https://example.com/news/vinamilk-vnm-reports-growth`).
  2. The tool scrapes the article, extracts stock codes (e.g., VNM), and predicts the trend (e.g., INCREASING).
  3. Results are displayed in the terminal.

- **Example Output**:
  ```
  🔗 URL: https://example.com/news/vinamilk-vnm-reports-growth
  🔍 Scraping article...
  🔠 Tokenizing...
  📈 Predicting...
  ✅ Predicted trend: INCREASING
  📊 Stocks mentioned: VNM
  ```

- **Customization**:
  - `--max_length`: Maximum text length for processing (default: 256 tokens). Increase to 512 if articles are long.
  - `--stock_cache_path`: Where stock mappings are cached.
  - `--exchanges`: Stock exchanges to include (default: HOSE,HNX,UPCOM).

### 🔮 Step 5: Programmatic Inference (Optional)

You can also use the model directly in Python scripts for batch predictions.

```python
from model import PhoBERTClassifier
classifier = PhoBERTClassifier(model_path="finetuned_phobert", max_length=256)
trends = classifier.predict(["Công ty Vinamilk tăng trưởng mạnh trong quý 3."])
print(trends)  # e.g., ["INCREASING"]
```

---

## 📦 Export to ONNX (Optional)

For faster deployment (e.g., in a web app), export the model to ONNX format.

```bash
python -m transformers.onnx --model=finetuned_phobert onnx_model/
```

---

## 🧠 Model Details

- **Base Model**: `vinai/phobert-base` (a Vietnamese BERT model)
- **Task**: Classifies news articles into 3 trends: INCREASING, DECREASING, UNCHANGED
- **Additional Feature**: Extracts stock codes using `vnstock` (fetches stock listings) and `fuzzywuzzy` (fuzzy matching for company names)

---

## 💡 Tips and Troubleshooting

- **Long Articles**: If articles are truncated (e.g., missing key details), increase `--max_length` (e.g., to 512), but ensure your hardware can handle it.
- **Scraping Issues**: If scraping fails, check your internet connection or try a different URL. The tool retries 3 times with a 2-second delay.
- **Non-Vietnamese Text**: The model is optimized for Vietnamese. If non-Vietnamese text is detected, you’ll see a warning, and results may be less accurate.
- **Stock Code Extraction**: If no stock codes are found, the article might not mention any companies, or the fuzzy matching threshold might be too high (adjustable in `stock_mapping.py`).

---

## 📝 License

This project is open-source for educational and research use. Feel free to contribute or adapt it for your needs!

---

## 🌟 Why Use This Model?

- **Vietnamese Focus**: Tailored for Vietnamese news with PhoBERT and `underthesea` tokenization.
- **Practical Insights**: Combines trend prediction with stock code extraction for actionable results.
- **Flexible and Extensible**: Easy to fine-tune, adjust, or integrate into larger systems.

Happy analyzing! 📊 If you have questions or need help, feel free to reach out.