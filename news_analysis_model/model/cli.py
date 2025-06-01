from preprocessing import scrape_article, tokenize_text
from model import PhoBERTClassifier
from stock_mapping import StockMapper
import validators
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="CLI for stock news trend prediction")
    parser.add_argument("--model_path", default="finetuned_phobert", help="Path to fine-tuned model")
    parser.add_argument("--max_length", type=int, default=256, help="Max input length for tokenization")
    parser.add_argument("--stock_cache_path", default="data/stock_cache.pkl", help="Path to stock mapping cache")
    parser.add_argument("--exchanges", default="HOSE,HNX,UPCOM", help="Comma-separated list of exchanges")
    return parser.parse_args()

def main_cli():
    args = parse_args()
    print("🔁 Enter stock news article URLs (type 'exit' to quit):")
    try:
        model = PhoBERTClassifier(model_path=args.model_path, max_length=args.max_length)
        mapper = StockMapper(cache_path=args.stock_cache_path, exchanges=args.exchanges)
    except Exception as e:
        print(f"❌ Error initializing model or stock mapper: {e}")
        return

    while True:
        url = input("🔗 URL: ").strip()
        if url.lower() == "exit":
            break
        if not validators.url(url):
            print("❌ Invalid URL format. Please enter a valid URL.")
            continue
        print("🔍 Scraping article...")
        text, stock_codes = scrape_article(url, mapper=mapper)
        if not text:
            print("❌ Could not extract article content.")
            continue
        try:
            print("🔠 Tokenizing...")
            tokens = tokenize_text(text)
            if not tokens:
                print("❌ Tokenization failed.")
                continue
            print("📈 Predicting...")
            prediction = model.predict([tokens])[0]
            print(f"✅ Predicted trend: {prediction}")
            print(f"📊 Stocks mentioned: {', '.join(stock_codes) if stock_codes else 'None'}")
            print()
        except Exception as e:
            print(f"❌ Error during processing: {e}")
            continue

if __name__ == "__main__":
    main_cli()