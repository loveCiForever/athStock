import json
import os

class Config():
    def __init__(self, config_path):
        # Define base directories
        self.BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.DATA_DIR = os.path.join(self.BASE_DIR, "data")
        self.OUTPUT_DIR = os.path.join(self.BASE_DIR, "output")
        self.LOGS_DIR = os.path.join(self.OUTPUT_DIR, "logs")
        
        self.config = {
            
        }

    def _load_config(self, config_path):
        with open(config_path, 'r') as file:
            config = json.load(file)
        return config
    
    def generate_default_config(self, config_path):
        """Generate default configuration and save to file"""
        self.config = {
            "crawler_config": {
                "base_url": "https://www.tinnhanhchungkhoan.vn",
                "search_url": "https://www.tinnhanhchungkhoan.vn/tim-kiem/",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
                "timeout": 30,
                "retry_times": 3,
                "delay": 2
            },
            "output_dir": os.path.join(self.OUTPUT_DIR, "article_lists"),
            "storage_config": {
                "raw_data_dir": os.path.join(self.DATA_DIR, "raw"),
                "processed_data_dir": os.path.join(self.DATA_DIR, "processed"),
                "features_dir": os.path.join(self.DATA_DIR, "features"),
                "models_dir": os.path.join(self.OUTPUT_DIR, "models"),
                "encoding": "utf-8"
            },
            "model_config": {
                "test_size": 0.2,
                "random_state": 42,
                "cv_folds": 5,
                "max_features": 5000,
                "ngram_range": [1, 2],
                "min_df": 2,
                "max_df": 0.95
            },
            "logging_config": {
                "log_dir": self.LOGS_DIR,
                "log_file": "app.log",
                "log_format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "log_level": "INFO"
            }
        }
        
        # Save the default config to file
        self.save_config(config_path)
        return self.config
        
    def save_config(self, config_path):
        with open(config_path, 'w') as file:
            json.dump(self.config, file, indent=4)

if __name__ == "__main__":
    config = Config("config.json")
    config.generate_default_config("config.json")
