import re
import unicodedata
from googletrans import Translator
import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
from src.config.config import Config

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = unicodedata.normalize('NFKC', text)
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def translate_vi_to_en(text):
    
    translator = Translator()
    try:
        result = translator.translate(text, src='en', dest='vi')
        print(f'[TRANSLATE] : {result.text}')
        return result.text
    except Exception as e:
        print(f'[TRANSLATE] error: {e}')
        return ''
    
def crawl_articles(stock_code, output_dir=None, config_path="config.json"):
    config = Config(config_path)
    crawler_cfg = config.config.get("crawler_config", {})
    base_url = crawler_cfg.get("search_url", "https://www.tinnhanhchungkhoan.vn/tim-kiem/")
    headers = crawler_cfg.get("headers", {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    })
    search_url = f"{base_url}?q={stock_code}"
    if not output_dir:
        output_dir = os.path.join(crawler_cfg.get("output_dir", ""), "article_lists")
    today = datetime.now().strftime("%y%m%d")
    filename = f"{stock_code}_{today}.json"
    output_json = os.path.join(output_dir, filename) if output_dir else filename
    response = requests.get(search_url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    box = soup.find("div", class_="box-content content-list")
    if not box:
        print("Article list not found!")
        return
    articles = []
    for article in box.find_all("article", class_="story"):
        h2 = article.find("h2", class_="story__heading")
        title = h2.get_text(strip=True) if h2 else None
        a_tag = h2.find("a", class_="cms-link") if h2 else None
        link = a_tag["href"] if a_tag and a_tag.has_attr("href") else None
        meta = article.find("div", class_="story__meta")
        time_tag = meta.find("time") if meta else None
        time_str = time_tag["datetime"] if time_tag and time_tag.has_attr("datetime") else None
        date_only = None
        if time_str:
            try:
                date_only = datetime.fromisoformat(time_str[:10]).strftime("%Y-%m-%d")
            except Exception:
                date_only = time_str[:10]
        articles.append({
            "time": date_only,
            "title": title,
            "link": link
        })
    articles = [a for a in articles if a["time"]]
    articles.sort(key=lambda x: x["time"])
    os.makedirs(os.path.dirname(output_json), exist_ok=True) if os.path.dirname(output_json) else None
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=4)
    print(f"Saved {len(articles)} articles to {output_json}")
    
def html_to_txt(html_path, txt_path=None):
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    paragraphs = [p.get_text(strip=True) for p in soup.find_all('p')]
    text = '\n'.join(paragraphs)
    if not txt_path:
        txt_path = os.path.splitext(html_path)[0] + '.txt'
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)
    return text 