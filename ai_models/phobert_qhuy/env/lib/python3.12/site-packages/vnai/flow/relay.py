# vnai/flow/relay.py
# Data transmission system (formerly sync)

import time
import threading
import json
import random
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

class Conduit:
    """Handles system telemetry flow"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls, webhook_url=None, buffer_size=50, sync_interval=300):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Conduit, cls).__new__(cls)
                cls._instance._initialize(webhook_url, buffer_size, sync_interval)
            return cls._instance
    
    def _initialize(self, webhook_url, buffer_size, sync_interval):
        """Initialize conduit"""
        self.webhook_url = webhook_url
        self.buffer_size = buffer_size
        self.sync_interval = sync_interval
        
        # Separate buffers for different data types
        self.buffer = {
            "function_calls": [],
            "api_requests": [],
            "rate_limits": []
        }
        
        self.lock = threading.Lock()
        self.last_sync_time = time.time()
        self.sync_count = 0
        self.failed_queue = []
        
        # Home directory setup
        self.home_dir = Path.home()
        self.project_dir = self.home_dir / ".vnstock"
        self.project_dir.mkdir(exist_ok=True)
        self.data_dir = self.project_dir / 'data'
        self.data_dir.mkdir(exist_ok=True)
        self.config_path = self.data_dir / "relay_config.json"
        
        # Get machine identifier from system profile
        try:
            from vnai.scope.profile import inspector
            self.machine_id = inspector.fingerprint()
        except:
            self.machine_id = self._generate_fallback_id()
        
        # Load config if exists
        self._load_config()
        
        # Start periodic sync
        self._start_periodic_sync()
    
    def _generate_fallback_id(self) -> str:
        """Generate a fallback machine identifier if profile is unavailable"""
        try:
            import platform
            import hashlib
            import uuid
            
            # Try to get machine-specific information
            system_info = platform.node() + platform.platform() + platform.processor()
            return hashlib.md5(system_info.encode()).hexdigest()
        except:
            import uuid
            return str(uuid.uuid4())
    
    def _load_config(self):
        """Load configuration from file"""
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r') as f:
                    config = json.load(f)
                    
                if not self.webhook_url and 'webhook_url' in config:
                    self.webhook_url = config['webhook_url']
                if 'buffer_size' in config:
                    self.buffer_size = config['buffer_size']
                if 'sync_interval' in config:
                    self.sync_interval = config['sync_interval']
                if 'last_sync_time' in config:
                    self.last_sync_time = config['last_sync_time']
                if 'sync_count' in config:
                    self.sync_count = config['sync_count']
            except:
                pass
    
    def _save_config(self):
        """Save configuration to file"""
        config = {
            'webhook_url': self.webhook_url,
            'buffer_size': self.buffer_size,
            'sync_interval': self.sync_interval,
            'last_sync_time': self.last_sync_time,
            'sync_count': self.sync_count
        }
        
        try:
            with open(self.config_path, 'w') as f:
                json.dump(config, f)
        except:
            pass
    
    def _start_periodic_sync(self):
        """Start periodic sync thread"""
        def periodic_sync():
            while True:
                time.sleep(self.sync_interval)
                self.dispatch("periodic")
        
        sync_thread = threading.Thread(target=periodic_sync, daemon=True)
        sync_thread.start()
    
    def add_function_call(self, record):
        """Add function call record"""
        # Ensure record is a dictionary
        if not isinstance(record, dict):
            record = {"value": str(record)}
            
        with self.lock:
            self.buffer["function_calls"].append(record)
            self._check_triggers("function_calls")
    
    def add_api_request(self, record):
        """Add API request record"""
        # Ensure record is a dictionary
        if not isinstance(record, dict):
            record = {"value": str(record)}
            
        with self.lock:
            self.buffer["api_requests"].append(record)
            self._check_triggers("api_requests")
    
    def add_rate_limit(self, record):
        """Add rate limit record"""
        # Ensure record is a dictionary
        if not isinstance(record, dict):
            record = {"value": str(record)}
            
        with self.lock:
            self.buffer["rate_limits"].append(record)
            self._check_triggers("rate_limits")
    
    def _check_triggers(self, record_type: str):
        """Check if any sync triggers are met"""
        current_time = time.time()
        should_trigger = False
        trigger_reason = None
        
        # Get total buffer size
        total_records = sum(len(buffer) for buffer in self.buffer.values())
        
        # SIZE TRIGGER: Buffer size threshold reached
        if total_records >= self.buffer_size:
            should_trigger = True
            trigger_reason = "buffer_full"
        
        # EVENT TRIGGER: Critical events (errors, rate limit warnings)
        elif record_type == "rate_limits" and self.buffer["rate_limits"] and \
             any(item.get("is_exceeded") for item in self.buffer["rate_limits"] if isinstance(item, dict)):
            should_trigger = True
            trigger_reason = "rate_limit_exceeded"
        elif record_type == "function_calls" and self.buffer["function_calls"] and \
             any(not item.get("success") for item in self.buffer["function_calls"] if isinstance(item, dict)):
            should_trigger = True
            trigger_reason = "function_error"
        
        # TIME-WEIGHTED RANDOM TRIGGER: More likely as time since last sync increases
        else:
            time_factor = min(1.0, (current_time - self.last_sync_time) / (self.sync_interval / 2))
            if random.random() < 0.05 * time_factor:  # 0-5% chance based on time
                should_trigger = True
                trigger_reason = "random_time_weighted"
        
        if should_trigger:
            threading.Thread(
                target=self.dispatch,
                args=(trigger_reason,),
                daemon=True
            ).start()
    
    def queue(self, package, priority=None):
        """Queue data package"""
        if not package:
            return False
            
        # Handle non-dictionary packages
        if not isinstance(package, dict):
            self.add_function_call({"message": str(package)})
            return True
            
        # Add timestamp if not present
        if "timestamp" not in package:
            package["timestamp"] = datetime.now().isoformat()
        
        # Route based on package type
        if "type" in package:
            package_type = package["type"]
            data = package.get("data", {})
            
            # Remove system info if present to avoid duplication
            if isinstance(data, dict) and "system" in data:
                # Get machine_id for reference but don't duplicate the whole system info
                machine_id = data["system"].get("machine_id")
                data.pop("system")
                if machine_id:
                    data["machine_id"] = machine_id
                    
            if package_type == "function":
                self.add_function_call(data)
            elif package_type == "api_request":
                self.add_api_request(data)
            elif package_type == "rate_limit":
                self.add_rate_limit(data)
            elif package_type == "system_info":
                # For system info, we'll add it as a special function call
                # but remove duplicated data
                self.add_function_call({
                    "type": "system_info",
                    "commercial": data.get("commercial"),
                    "packages": data.get("packages"),
                    "timestamp": package.get("timestamp")
                })
            elif package_type == "metrics":
                # Handle metrics package with multiple categories
                metrics_data = data
                for metric_type, metrics_list in metrics_data.items():
                    if isinstance(metrics_list, list):
                        if metric_type == "function":
                            for item in metrics_list:
                                self.add_function_call(item)
                        elif metric_type == "rate_limit":
                            for item in metrics_list:
                                self.add_rate_limit(item)
                        elif metric_type == "request":
                            for item in metrics_list:
                                self.add_api_request(item)
            else:
                # Default to function calls
                self.add_function_call(data)
        else:
            # No type specified, default to function call
            self.add_function_call(package)
            
        # Handle high priority items
        if priority == "high":
            self.dispatch("high_priority")
            
        return True
    
    def dispatch(self, reason="manual"):
        """Send queued data"""
        if not self.webhook_url:
            return False
            
        with self.lock:
            # Check if all buffers are empty
            if all(len(records) == 0 for records in self.buffer.values()):
                return False
                
            # Create a copy of the buffer for sending
            data_to_send = {
                "function_calls": self.buffer["function_calls"].copy(),
                "api_requests": self.buffer["api_requests"].copy(),
                "rate_limits": self.buffer["rate_limits"].copy()
            }
            
            # Clear buffer
            self.buffer = {
                "function_calls": [],
                "api_requests": [],
                "rate_limits": []
            }
            
            # Update sync time and count
            self.last_sync_time = time.time()
            self.sync_count += 1
            self._save_config()
        
        # Get environment information ONCE
        try:
            from vnai.scope.profile import inspector
            environment_info = inspector.examine()
            machine_id = environment_info.get("machine_id", self.machine_id)
        except:
            # Fallback if environment info isn't available
            environment_info = {"machine_id": self.machine_id}
            machine_id = self.machine_id
        
        # Create payload with environment info only in metadata
        payload = {
            "analytics_data": data_to_send,
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "machine_id": machine_id,
                "sync_count": self.sync_count,
                "trigger_reason": reason,
                "environment": environment_info,
                "data_counts": {
                    "function_calls": len(data_to_send["function_calls"]),
                    "api_requests": len(data_to_send["api_requests"]),
                    "rate_limits": len(data_to_send["rate_limits"])
                }
            }
        }
        
        # Send data
        success = self._send_data(payload)
        
        if not success:
            with self.lock:
                self.failed_queue.append(payload)
                if len(self.failed_queue) > 10:
                    self.failed_queue = self.failed_queue[-10:]
        
        return success
    
    def _send_data(self, payload):
        """Send data to webhook"""
        if not self.webhook_url:
            return False
            
        try:
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=5  # 5 second timeout
            )
            
            return response.status_code == 200
        except:
            return False
    
    def retry_failed(self):
        """Retry sending failed data"""
        if not self.failed_queue:
            return 0
            
        with self.lock:
            to_retry = self.failed_queue.copy()
            self.failed_queue = []
        
        success_count = 0
        for payload in to_retry:
            if self._send_data(payload):
                success_count += 1
            else:
                with self.lock:
                    self.failed_queue.append(payload)
        
        return success_count
    
    def configure(self, webhook_url):
        """Configure webhook URL"""
        with self.lock:
            self.webhook_url = webhook_url
            self._save_config()
            return True

# Create singleton instance
conduit = Conduit()

# Exposed functions that match sync.py naming pattern
def track_function_call(function_name, source, execution_time, success=True, error=None, args=None):
    """Track function call (bridge to add_function_call)"""
    record = {
        "function": function_name,
        "source": source,
        "execution_time": execution_time,
        "timestamp": datetime.now().isoformat(),
        "success": success
    }
    
    if error:
        record["error"] = error
        
    if args:
        # Sanitize arguments
        sanitized_args = {}
        if isinstance(args, dict):
            for key, value in args.items():
                if isinstance(value, (str, int, float, bool)):
                    sanitized_args[key] = value
                else:
                    sanitized_args[key] = str(type(value))
        else:
            sanitized_args = {"value": str(args)}
        record["args"] = sanitized_args
    
    conduit.add_function_call(record)

def track_rate_limit(source, limit_type, limit_value, current_usage, is_exceeded):
    """Track rate limit checks (bridge to add_rate_limit)"""
    record = {
        "source": source,
        "limit_type": limit_type,
        "limit_value": limit_value,
        "current_usage": current_usage,
        "is_exceeded": is_exceeded,
        "timestamp": datetime.now().isoformat(),
        "usage_percentage": (current_usage / limit_value) * 100 if limit_value > 0 else 0
    }
    
    conduit.add_rate_limit(record)

def track_api_request(endpoint, source, method, status_code, execution_time, request_size=0, response_size=0):
    """Track API requests (bridge to add_api_request)"""
    record = {
        "endpoint": endpoint,
        "source": source,
        "method": method,
        "status_code": status_code,
        "execution_time": execution_time,
        "timestamp": datetime.now().isoformat(),
        "request_size": request_size,
        "response_size": response_size
    }
    
    conduit.add_api_request(record)

def configure(webhook_url):
    """Configure webhook URL"""
    return conduit.configure(webhook_url)

def sync_now():
    """Manually trigger synchronization"""
    return conduit.dispatch("manual")

def retry_failed():
    """Retry failed synchronizations"""
    return conduit.retry_failed()
