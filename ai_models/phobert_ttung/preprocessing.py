import requests
from bs4 import BeautifulSoup
from underthesea import word_tokenize

def scrape_article(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
        soup = BeautifulSoup(response.content, "html.parser")
        paragraphs = soup.find_all("p")
        text = " ".join([p.get_text() for p in paragraphs])
        return text.strip()
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def tokenize_text(text):
    return word_tokenize(text, format="text")
