import argparse
from src.data_manager.data_manager import DataManager
from src.model.model_trainer import ModelTrainer
from src.model.model_evaluator import ModelEvaluator
from src.model.predictor import Predictor
from src.config.config import Config
import pandas as pd
import json
from datetime import datetime
import os

def train_model(config_path='config.json'):
    dm = DataManager(config_path=config_path)
    X_train, X_test, y_train, y_test = dm.prepare_data()
    trainer = ModelTrainer()
    model = trainer.train(X_train, y_train)
    trainer.save('trained_model.pkl')
    print(f"Model saved at trained_model.pkl")
    evaluator = ModelEvaluator(model)
    results = evaluator.evaluate(X_test, y_test)
    print("\nEvaluation results:")
    print(f"Accuracy: {results['accuracy']:.4f}")
    print(f"F1 macro: {results['f1_macro']:.4f}")
    print("Confusion matrix:")
    print(results['confusion_matrix'])
    print("\nClassification report:")
    from pprint import pprint
    pprint(results['classification_report'])

def predict_articles(stockcode, config_path='config.json'):
    dm = DataManager(config_path=config_path)
    json_path = dm.prepare_predict_data(stock_code=stockcode)
    if not json_path or not os.path.exists(json_path):
        print('Cannot prepare prediction data!')
        return
    # Đọc dữ liệu dự đoán từ file JSON vừa tạo
    with open(json_path, 'r', encoding='utf-8') as f:
        predict_data = json.load(f)
    predictor = Predictor('trained_model.pkl')
    article_results = []
    for art in predict_data.values():
        content_list = art.get('content', [])
        time = art.get('time', '')
        if not content_list:
            continue
        label_counts = {'neutral': 0, 'positive': 0, 'negative': 0}
        for paragraph in content_list:
            label, _, _ = predictor.predict(paragraph)
            if label in label_counts:
                label_counts[label] += 1
        total = sum(label_counts.values())
        if total == 0:
            continue
        ratios = {k: v/total for k, v in label_counts.items()}
        max_label = max(ratios, key=ratios.get)
        article_results.append({
            'time': time,
            'label': max_label,
            'neutral': ratios['neutral'],
            'negative': ratios['negative'],
            'positive': ratios['positive']
        })
    df = pd.DataFrame(article_results)
    if df.empty:
        print('No article data for prediction!')
        return
    df['time'] = pd.to_datetime(df['time'])
    day_group = df.groupby('time').agg({
        'neutral': 'mean',
        'negative': 'mean',
        'positive': 'mean'
    })
    day_group['label'] = day_group[['neutral', 'negative', 'positive']].idxmax(axis=1)
    day_group = day_group[['label', 'neutral', 'negative', 'positive']]
    min_date = df['time'].min()
    max_date = df['time'].max()
    all_days = pd.date_range(min_date, max_date, freq='D')
    day_group = day_group.reindex(all_days, method='ffill')
    day_group = day_group.reset_index().rename(columns={'index': 'time'})
    day_group['time'] = day_group['time'].dt.strftime('%Y-%m-%d')
    today = datetime.now().strftime('%y%m%d')
    output_path = f"{stockcode}_{today}_pred.csv"
    day_group.to_csv(output_path, index=False, encoding='utf-8')
    print(f"Results saved to {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Train hoặc dự đoán cảm xúc bài báo.")
    parser.add_argument('--train', action='store_true', help='Huấn luyện model')
    parser.add_argument('--predict', action='store_true', help='Dự đoán cảm xúc cho mã cổ phiếu')
    parser.add_argument('--stockcode', type=str, help='Mã cổ phiếu để dự đoán')
    parser.add_argument('--config', action='store_true', help='Tạo file config.json mặc định')
    args = parser.parse_args()
    if args.config:
        config = Config('config.json')
        config.generate_default_config('config.json')
        print('Đã tạo file config.json mặc định tại thư mục gốc.')
        return
    if args.train:
        train_model(config_path="config.json")
    elif args.predict and args.stockcode:
        predict_articles(args.stockcode, config_path="config.json")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
