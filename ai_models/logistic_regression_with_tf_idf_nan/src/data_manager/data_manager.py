from src.data_manager.data_trainer import DataTrainer
from src.data_manager.data_predictor import PrepareDataPredict
from src.config.config import Config

class DataManager:
    def __init__(self, config_path='config.json'):
        config = Config(config_path)
        self.config_path = config_path
        data_cfg = config.config.get('data_config', {})
        data_path = data_cfg.get('data_path', 'data.csv')
        text_col = data_cfg.get('text_col', 'text')
        label_col = data_cfg.get('label_col', 'label')
        date_col = data_cfg.get('date_col', None)
        test_size = data_cfg.get('test_size', 0.2)
        random_state = data_cfg.get('random_state', 42)
        self.trainer = DataTrainer(
            data_path=data_path,
            text_col=text_col,
            label_col=label_col,
            date_col=date_col,
            test_size=test_size,
            random_state=random_state
        )

    def prepare_data(self):
        return self.trainer.prepare_data() 
    
    def prepare_predict_data(self, stock_code):
        predictor = PrepareDataPredict(self.config_path)
        return predictor.prepare_predict_data(stock_code=stock_code)