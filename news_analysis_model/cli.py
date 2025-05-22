from preprocessing import scrape_article, tokenize_text
from model import PhoBERTClassifier

def main_cli():
    print("🔁 Enter stock news article URLs (type 'exit' to quit):")
    model = PhoBERTClassifier()

    while True:
        url = input("🔗 URL: ").strip()
        if url.lower() == "exit":
            break
        print("🔍 Scraping article...")
        text = scrape_article(url)
        if not text:
            print("❌ Could not extract article content.\n")
            continue

        print("🔠 Tokenizing...")
        tokens = tokenize_text(text)

        print("📈 Predicting...")
        prediction = model.predict(tokens)
        print(f"✅ Predicted trend: {prediction}\n")
