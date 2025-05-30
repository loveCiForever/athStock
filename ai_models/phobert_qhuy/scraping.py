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

def scrape_vnexpress_listing(max_pages=5):
    base_url = "https://vnexpress.net/kinh-doanh/chung-khoan"
    items = []

    for page in range(1, max_pages + 1):
        url = f"{base_url}-p{page}"
        html = fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        for a in soup.select(".title-news a[href]"):
            items.append({
                "title": a.text.strip(),
                "url": a["href"]
            })

    return items

def scrape_article_detail(url, site, start_date=None, end_date=None):
    html = fetch_page(url)
    soup = BeautifulSoup(html, "lxml")
    publish_date = parse_publish_date(soup)

    if start_date and end_date:
        publish_dt = datetime.strptime(publish_date, "%H:%M:%S - %d/%m/%Y")
        if not (start_date <= publish_dt <= end_date):
            return None, None

    if site == "cafef":
        body = soup.select_one("#divNewsContent")
    elif site == "vietstock":
        body = soup.select_one(".article-body__content")
    else:  # vnexpress
        body = soup.select_one(".fck_detail")
    paragraphs = [p.get_text(strip=True) for p in body.find_all("p")] if body else []
    content = "\n\n".join(paragraphs)
    return publish_date, content

def run():
    # 1.
    crawl_date = datetime.now().strftime("%H:%M:%S %d/%m/%Y")
    # file_stamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    start_date = datetime.strptime("01/05/2025", "%d/%m/%Y")
    end_date = datetime.strptime("31/05/2025", "%d/%m/%Y")

    output = {
        "crawl_date": crawl_date,
        "from": start_date.strftime("%d/%m/%Y"),
        "to": end_date.strftime("%d/%m/%Y"),

        "cafef": [],
        "vietstock": [],
        "vnexpress": []
    }

    # 2. crawl listing
    cafef_list     = scrape_cafef_listing()
    vietstock_list      = scrape_vietstock_listing()
    vnexpress_list = scrape_vnexpress_listing()

    # 3. for each site, add details to output file
    # for item in cafef_list:
    #     pub_date, content = scrape_article_detail(item["url"], site="cafef")
    #     output["cafef"].append({
    #         "title":        item["title"],
    #         "url":          item["url"],
    #         "publish_date": pub_date,
    #         "content":      content
    #     })
    #     time.sleep(1)

    # for item in vietstock_list:
    #     pub_date, content = scrape_article_detail(item["url"], site="vietstock")
    #     output["vietstock"].append({
    #         "title":        item["title"],
    #         "url":          item["url"],
    #         "publish_date": pub_date,
    #         "content":      content
    #     })
    #     time.sleep(1)

    for item in vnexpress_list:
        pub_date, content = scrape_article_detail(item["url"], site="vnexpress", start_date=start_date, end_date=end_date)
        if pub_date and content:
            output["vnexpress"].append({
                "title": item["title"],
                "url": item["url"],
                "publish_date": pub_date,
                "content": content
            })
        time.sleep(1)

    # 4. save JSON
    with open(f"./data/raw/articles/articles.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    run()
