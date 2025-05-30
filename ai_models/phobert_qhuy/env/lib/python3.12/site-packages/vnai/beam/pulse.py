# vnai/beam/pulse.py
# System health and performance monitoring

import threading
import time
from datetime import datetime

class Monitor:
    """Monitors system health and performance"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Monitor, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance
    
    def _initialize(self):
        """Initialize monitor"""
        self.health_status = "healthy"
        self.last_check = time.time()
        self.check_interval = 300  # seconds
        self.error_count = 0
        self.warning_count = 0
        self.status_history = []
        
        # Start background health check thread
        self._start_background_check()
    
    def _start_background_check(self):
        """Start background health check thread"""
        def check_health():
            while True:
                try:
                    self.check_health()
                except:
                    pass  # Don't let errors stop the monitor
                time.sleep(self.check_interval)
        
        thread = threading.Thread(target=check_health, daemon=True)
        thread.start()
    
    def check_health(self):
        """Check system health status"""
        from vnai.beam.metrics import collector
        from vnai.beam.quota import guardian
        
        # Record check time
        self.last_check = time.time()
        
        # Check metrics collector health
        metrics_summary = collector.get_metrics_summary()
        has_errors = metrics_summary.get("error", 0) > 0
        
        # Check resource usage
        resource_usage = guardian.usage()
        high_usage = resource_usage > 80  # Over 80% of rate limits
        
        # Determine health status
        if has_errors and high_usage:
            self.health_status = "critical"
            self.error_count += 1
        elif has_errors or high_usage:
            self.health_status = "warning"
            self.warning_count += 1
        else:
            self.health_status = "healthy"
        
        # Record health status
        self.status_history.append({
            "timestamp": datetime.now().isoformat(),
            "status": self.health_status,
            "metrics": metrics_summary,
            "resource_usage": resource_usage
        })
        
        # Keep history limited to last 10 entries
        if len(self.status_history) > 10:
            self.status_history = self.status_history[-10:]
        
        return self.health_status
    
    def report(self):
        """Get health report"""
        # Ensure we have a fresh check if last one is old
        if time.time() - self.last_check > self.check_interval:
            self.check_health()
            
        return {
            "status": self.health_status,
            "last_check": datetime.fromtimestamp(self.last_check).isoformat(),
            "error_count": self.error_count,
            "warning_count": self.warning_count,
            "history": self.status_history[-3:],  # Last 3 entries
        }
    
    def reset(self):
        """Reset health monitor"""
        self.health_status = "healthy"
        self.error_count = 0
        self.warning_count = 0
        self.status_history = []
        self.last_check = time.time()

# Create singleton instance
monitor = Monitor()
