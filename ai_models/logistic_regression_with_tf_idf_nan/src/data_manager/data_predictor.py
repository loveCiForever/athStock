import os
import requests
import json
from src.utils.data import crawl_articles
from datetime import datetime
from bs4 import BeautifulSoup
from src.config.config import Config

class PrepareDataPredict:
    def __init__(self, config_path='config.json'):
        self.config_path = config_path
        self.config = Config(config_path)
        self.crawler_cfg = self.config.config.get('crawler_config', {})
        self.output_dir = self.crawler_cfg.get('output_dir', 'article_lists')
        
    def prepare_predict_data(self, stock_code):
        crawl_articles(stock_code, config_path=self.config_path)
        output_dir = self.crawler_cfg.get('output_dir', 'article_lists')
        files = [f for f in os.listdir(output_dir) if f.startswith(stock_code) and f.endswith('.json')]
        if not files:
            print(f"Not found json file for {stock_code} in {output_dir}")
            return
        latest_file = max(files, key=lambda x: os.path.getmtime(os.path.join(output_dir, x)))
        json_path = os.path.join(output_dir, latest_file)
        with open(json_path, 'r', encoding='utf-8') as f:
            articles = json.load(f)
        data = {}
        for idx, art in enumerate(articles):
            paragraphs = []
            try:
                resp = requests.get(art['link'], timeout=10)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, 'html.parser')
                ps = soup.find_all('p')
                for p in ps:
                    text = p.get_text(strip=True)
                    if text:
                        paragraphs.append(text)
            except Exception as e:
                print(f'Error loading {art["link"]}: {e}')
            data[f'article {idx+1}'] = {
                'time': art.get('time', ''),
                'content': paragraphs
            }
        today = datetime.now().strftime('%y%m%d')
        filename = f"{stock_code}_predict_{today}.json"
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, filename)
        else:
            output_path = filename
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f'Saved data to {output_path}')
        return output_path

    

    