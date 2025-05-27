import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def fetch_page(url):
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    return resp.text

def parse_publish_date(soup):
    span = soup.find("span", class_="date")
    if not span:
        return None
    raw = span.get_text(strip=True)
    parts = raw.split(",")
    date_part = parts[-2].strip()               # '27/5/2025'
    time_part = parts[-1].split("(")[0].strip()  # '16:35'
    dt = datetime.strptime(f"{date_part} {time_part}:00", "%d/%m/%Y %H:%M:%S")
    return dt.strftime("%H:%M:%S - %d/%m/%Y")

def scrape_cafef_listing():
    url = "https://cafef.vn/thi-truong-chung-khoan.chn"
    html = fetch_page(url)
    soup = BeautifulSoup(html, "lxml")
    items = []
    for node in soup.select(".cateleft .news"):
        a = node.find("a", href=True)
        items.append({
            "title": a.text.strip(),
            "url": "https://cafef.vn" + a["href"]
        })
    return items

def scrape_vietstock_listing():
    url = "https://vietstock.vn/chung-khoan.htm"
    html = fetch_page(url)
    soup = BeautifulSoup(html, "lxml")
    items = []
    for node in soup.select(".news-list__item"):
        a = node.find("a", href=True)
        items.append({
            "title": a.text.strip(),
            "url": "https://vietstock.vn" + a["href"]
        })
    return items

def scrape_vnexpress_listing():
    url = "https://vnexpress.net/kinh-doanh/chung-khoan"
    html = fetch_page(url)
    soup = BeautifulSoup(html, "lxml")
    items = []
    for a in soup.select(".title-news a[href]"):
        items.append({
            "title": a.text.strip(),
            "url": a["href"]
        })
    return items

def scrape_article_detail(url, site):
    html = fetch_page(url)
    soup = BeautifulSoup(html, "lxml")
    publish_date = parse_publish_date(soup)
    if site == "cafef":
        body = soup.select_one("#divNewsContent")
    elif site == "vietstock":
        body = soup.select_one(".article-body__content")
    else:  # vnexpress
        body = soup.select_one(".fck_detail")
    paragraphs = [p.get_text(strip=True) for p in body.find_all("p")] if body else []
    content = "\n\n".join(paragraphs)
    return publish_date, content

def main():
    # 1.
    crawl_date = datetime.now().strftime("%H/%M/%S %d/%m/%Y")
    file_stamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    output = {
        "crawl_date": crawl_date,
        "cafef": [],
        "vietstock": [],
        "vnexpress": []
    }

    # 2. crawl listing
    cafef_list     = scrape_cafef_listing()
    viet_list      = scrape_vietstock_listing()
    vnexpress_list = scrape_vnexpress_listing()

    # 3. for each site, add details to output file
    for item in cafef_list:
        pub_date, content = scrape_article_detail(item["url"], site="cafef")
        output["cafef"].append({
            "title":        item["title"],
            "url":          item["url"],
            "publish_date": pub_date,
            "content":      content
        })
        time.sleep(1)

    for item in viet_list:
        pub_date, content = scrape_article_detail(item["url"], site="vietstock")
        output["vietstock"].append({
            "title":        item["title"],
            "url":          item["url"],
            "publish_date": pub_date,
            "content":      content
        })
        time.sleep(1)

    for item in vnexpress_list[:5]: 
        pub_date, content = scrape_article_detail(item["url"], site="vnexpress")
        output["vnexpress"].append({
            "title":        item["title"],
            "url":          item["url"],
            "publish_date": pub_date,
            "content":      content
        })
        time.sleep(1)

    # 4. save JSON
    with open(f"./data/articles_{file_stamp}.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
