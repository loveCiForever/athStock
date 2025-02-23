```
Stock Price Prediction System
│
├── Data Collection Container
│   │
│   ├── Data Fetcher (Python/vnstock)
│   │   ├── Fetches Data from VNStock API
│   │   ├── Uses Stock Data Fetcher (vnstock API)
│   │   ├── Uses Path Manager (OS Utils)
│   │   └── Saves Data to File System (CSV Files)
│   │
│   ├── Data Collection Components
│   │   ├── Stock Data Fetcher (vnstock API)
│   │   └── Path Manager (OS Utils)
│
├── Data Processing Container
│   │
│   ├── Data Processor (Python/pandas)
│   │   ├── Reads Data from File System
│   │   ├── Uses Data Loader (pandas)
│   │   ├── Uses Data Cleaner (pandas)
│   │   ├── Uses Feature Creator (pandas)
│   │   ├── Uses Data Scaler (sklearn)
│   │   ├── Uses Data Merger (pandas)
│   │   └── Saves Processed Data to File System
│   │
│   ├── Data Processing Components
│   │   ├── Data Loader (pandas)
│   │   ├── Data Cleaner (pandas)
│   │   ├── Feature Creator (pandas)
│   │   ├── Data Scaler (sklearn)
│   │   └── Data Merger (pandas)
│
├── Pattern Analysis Container
│   │
│   ├── Pattern Generator (Python/numpy)
│   │   ├── Uses Trend Up Generator (numpy)
│   │   ├── Uses Trend Down Generator (numpy)
│   │   ├── Uses Volatile Pattern Generator (numpy)
│   │   ├── Uses Stable Pattern Generator (numpy)
│   │   └── Saves Patterns to File System
│   │
│   ├── Pattern Components
│   │   ├── Trend Up Generator (numpy)
│   │   ├── Trend Down Generator (numpy)
│   │   ├── Volatile Pattern Generator (numpy)
│   │   └── Stable Pattern Generator (numpy)
│
├── Model Training Container
│   │
│   ├── Model Trainer (sklearn)
│   │   ├── Loads Data from File System
│   │   ├── Uses Data Splitter (sklearn)
│   │   ├── Uses Linear Regressor (sklearn)
│   │   ├── Uses Model Evaluator (sklearn.metrics)
│   │   ├── Uses Model Persistence (joblib)
│   │   └── Stores Model in File System
│   │
│   ├── Training Components
│   │   ├── Data Splitter (sklearn)
│   │   ├── Linear Regressor (sklearn)
│   │   ├── Model Evaluator (sklearn.metrics)
│   │   └── Model Persistence (joblib)
│
├── External Systems
│   ├── VNStock API (External Service)
│
└── User
    ├── Initiates Process in Data Fetcher
```
