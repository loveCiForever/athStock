# vnai/scope/state.py
# System state tracking

import time
import threading
import json
import os
from datetime import datetime
from pathlib import Path

class Tracker:
    """Tracks system state and performance metrics"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Tracker, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance
    
    def _initialize(self):
        """Initialize tracker"""
        self.metrics = {
            "startup_time": datetime.now().isoformat(),
            "function_calls": 0,
            "api_requests": 0,
            "errors": 0,
            "warnings": 0
        }
        
        self.performance_metrics = {
            "execution_times": [],
            "last_error_time": None,
            "peak_memory": 0
        }
        
        self.privacy_level = "standard"
        
        # Setup data directory
        self.home_dir = Path.home()
        self.project_dir = self.home_dir / ".vnstock"
        self.project_dir.mkdir(exist_ok=True)
        self.data_dir = self.project_dir / 'data'
        self.data_dir.mkdir(exist_ok=True)
        self.metrics_path = self.data_dir / "usage_metrics.json"
        self.privacy_config_path = self.project_dir / 'config' / "privacy.json"
        
        # Create config directory if it doesn't exist
        os.makedirs(os.path.dirname(self.privacy_config_path), exist_ok=True)
        
        # Load existing metrics
        self._load_metrics()
        
        # Load privacy settings
        self._load_privacy_settings()
        
        # Start background metrics collector
        self._start_background_collector()
    
    def _load_metrics(self):
        """Load metrics from file"""
        if self.metrics_path.exists():
            try:
                with open(self.metrics_path, 'r') as f:
                    stored_metrics = json.load(f)
                    
                # Update metrics with stored values
                for key, value in stored_metrics.items():
                    if key in self.metrics:
                        self.metrics[key] = value
            except:
                pass
    
    def _save_metrics(self):
        """Save metrics to file"""
        try:
            with open(self.metrics_path, 'w') as f:
                json.dump(self.metrics, f)
        except:
            pass
    
    def _load_privacy_settings(self):
        """Load privacy settings"""
        if self.privacy_config_path.exists():
            try:
                with open(self.privacy_config_path, 'r') as f:
                    settings = json.load(f)
                    self.privacy_level = settings.get("level", "standard")
            except:
                pass
    
    def setup_privacy(self, level=None):
        """Configure privacy level for data collection"""
        privacy_levels = {
            "minimal": "Essential system data only",
            "standard": "Performance metrics and errors",
            "enhanced": "Detailed operation analytics" 
        }
        
        if level is None:
            # Default level
            level = "standard"
        
        if level not in privacy_levels:
            raise ValueError(f"Invalid privacy level: {level}. Choose from {', '.join(privacy_levels.keys())}")
        
        # Store preference
        self.privacy_level = level
        
        # Store in configuration file
        with open(self.privacy_config_path, "w") as f:
            json.dump({"level": level}, f)
        
        return level
    
    def get_privacy_level(self):
        """Get current privacy level"""
        return self.privacy_level
    
    def _start_background_collector(self):
        """Start background metrics collection"""
        def collect_metrics():
            while True:
                try:
                    import psutil
                    
                    # Update peak memory
                    current_process = psutil.Process()
                    memory_info = current_process.memory_info()
                    memory_usage = memory_info.rss / (1024 * 1024)  # MB
                    
                    if memory_usage > self.performance_metrics["peak_memory"]:
                        self.performance_metrics["peak_memory"] = memory_usage
                        
                    # Save metrics periodically
                    self._save_metrics()
                    
                except:
                    pass
                    
                time.sleep(300)  # Run every 5 minutes
        
        # Start thread
        thread = threading.Thread(target=collect_metrics, daemon=True)
        thread.start()
    
    def record(self, event_type, data=None):
        """Record an event"""
        # Check privacy level
        if self.privacy_level == "minimal" and event_type != "errors":
            # In minimal mode, only track errors
            return True
            
        # Update counts
        if event_type in self.metrics:
            self.metrics[event_type] += 1
        else:
            self.metrics[event_type] = 1
            
        # Special handling for errors
        if event_type == "errors":
            self.performance_metrics["last_error_time"] = datetime.now().isoformat()
            
        # Special handling for function calls with timing data
        if event_type == "function_calls" and data and "execution_time" in data:
            # Keep up to 100 latest execution times
            self.performance_metrics["execution_times"].append(data["execution_time"])
            if len(self.performance_metrics["execution_times"]) > 100:
                self.performance_metrics["execution_times"] = self.performance_metrics["execution_times"][-100:]
                
        # Save if metrics change significantly
        if self.metrics["function_calls"] % 100 == 0 or event_type == "errors":
            self._save_metrics()
            
        return True
    
    def get_metrics(self):
        """Get current metrics"""
        # Calculate derived metrics
        avg_execution_time = 0
        if self.performance_metrics["execution_times"]:
            avg_execution_time = sum(self.performance_metrics["execution_times"]) / len(self.performance_metrics["execution_times"])
            
        # Add derived metrics to output
        output = self.metrics.copy()
        output.update({
            "avg_execution_time": avg_execution_time,
            "peak_memory_mb": self.performance_metrics["peak_memory"],
            "uptime": (datetime.now() - datetime.fromisoformat(self.metrics["startup_time"])).total_seconds(),
            "privacy_level": self.privacy_level
        })
        
        return output
    
    def reset(self):
        """Reset metrics"""
        self.metrics = {
            "startup_time": datetime.now().isoformat(),
            "function_calls": 0,
            "api_requests": 0,
            "errors": 0,
            "warnings": 0
        }
        
        self.performance_metrics = {
            "execution_times": [],
            "last_error_time": None,
            "peak_memory": 0
        }
        
        self._save_metrics()
        return True

# Create singleton instance
tracker = Tracker()


def record(event_type, data=None):
    """Record an event"""
    return tracker.record(event_type, data)
