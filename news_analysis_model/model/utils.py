import requests
from bs4 import BeautifulSoup
from underthesea import word_tokenize
import validators
from langdetect import detect
import retrying

def scrape_article(url):
    if not validators.url(url):
        raise ValueError("Invalid URL format")
    
    @retrying.retry(stop_max_attempt_number=3, wait_fixed=2000)
    def fetch_url(url):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response
    
    try:
        response = fetch_url(url)
        soup = BeautifulSoup(response.content, "html.parser")
        # Extract more elements for comprehensive content
        elements = soup.find_all(["p", "h1", "h2", "li"])
        text = " ".join([elem.get_text(strip=True) for elem in elements if elem.get_text(strip=True)])
        if not text:
            return None
        return text
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def tokenize_text(text):
    if not text or not isinstance(text, str):
        raise ValueError("Input text must be a non-empty string")
    try:
        # Detect language to ensure Vietnamese tokenization
        lang = detect(text)
        if lang != "vi":
            print(f"Warning: Detected non-Vietnamese text (language: {lang}). Using default tokenization.")
        return word_tokenize(text, format="text")
    except Exception as e:
        print(f"Error tokenizing text: {e}")
        return None