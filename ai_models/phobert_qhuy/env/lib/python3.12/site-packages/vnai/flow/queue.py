# vnai/flow/queue.py
# Data buffering system

import time
import threading
import json
from datetime import datetime
from pathlib import Path

class Buffer:
    """Manages data buffering with persistence"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Buffer, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance
    
    def _initialize(self):
        """Initialize buffer"""
        self.data = []
        self.lock = threading.Lock()
        self.max_size = 1000
        self.backup_interval = 300  # 5 minutes
        
        # Setup data directory
        self.home_dir = Path.home()
        self.project_dir = self.home_dir / ".vnstock"
        self.project_dir.mkdir(exist_ok=True)
        self.data_dir = self.project_dir / 'data'
        self.data_dir.mkdir(exist_ok=True)
        self.backup_path = self.data_dir / "buffer_backup.json"
        
        # Load from backup if exists
        self._load_from_backup()
        
        # Start backup thread
        self._start_backup_thread()
    
    def _load_from_backup(self):
        """Load data from backup file"""
        if self.backup_path.exists():
            try:
                with open(self.backup_path, 'r') as f:
                    backup_data = json.load(f)
                    
                with self.lock:
                    self.data = backup_data
            except:
                pass
    
    def _save_to_backup(self):
        """Save data to backup file"""
        with self.lock:
            if not self.data:
                return
                
            try:
                with open(self.backup_path, 'w') as f:
                    json.dump(self.data, f)
            except:
                pass
    
    def _start_backup_thread(self):
        """Start background backup thread"""
        def backup_task():
            while True:
                time.sleep(self.backup_interval)
                self._save_to_backup()
        
        backup_thread = threading.Thread(target=backup_task, daemon=True)
        backup_thread.start()
    
    def add(self, item, category=None):
        """Add item to buffer"""
        with self.lock:
            # Add metadata
            if isinstance(item, dict):
                if "timestamp" not in item:
                    item["timestamp"] = datetime.now().isoformat()
                if category:
                    item["category"] = category
            
            # Add to buffer
            self.data.append(item)
            
            # Trim if exceeds max size
            if len(self.data) > self.max_size:
                self.data = self.data[-self.max_size:]
            
            # Save to backup if buffer gets large
            if len(self.data) % 100 == 0:
                self._save_to_backup()
                
            return len(self.data)
    
    def get(self, count=None, category=None):
        """Get items from buffer with optional filtering"""
        with self.lock:
            if category:
                filtered_data = [item for item in self.data if item.get("category") == category]
            else:
                filtered_data = self.data.copy()
            
            if count:
                return filtered_data[:count]
            else:
                return filtered_data
    
    def clear(self, category=None):
        """Clear buffer, optionally by category"""
        with self.lock:
            if category:
                self.data = [item for item in self.data if item.get("category") != category]
            else:
                self.data = []
            
            self._save_to_backup()
            return len(self.data)
    
    def size(self, category=None):
        """Get buffer size, optionally by category"""
        with self.lock:
            if category:
                return len([item for item in self.data if item.get("category") == category])
            else:
                return len(self.data)

# Create singleton instance
buffer = Buffer()
