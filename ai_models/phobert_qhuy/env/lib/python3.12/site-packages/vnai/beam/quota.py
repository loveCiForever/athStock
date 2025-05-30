# vnai/beam/quota.py
# Resource allocation and management (formerly rate_limiter)

import time
import functools
import threading
from collections import defaultdict
from datetime import datetime

class RateLimitExceeded(Exception):
    """Custom exception for rate limit violations."""
    def __init__(self, resource_type, limit_type="min", current_usage=None, limit_value=None, retry_after=None):
        self.resource_type = resource_type
        self.limit_type = limit_type
        self.current_usage = current_usage
        self.limit_value = limit_value
        self.retry_after = retry_after
        
        # Create a user-friendly message
        message = f"Bạn đã gửi quá nhiều request tới {resource_type}. "
        if retry_after:
            message += f"Vui lòng thử lại sau {round(retry_after)} giây."
        else:
            message += "Vui lòng thêm thời gian chờ giữa các lần gửi request."
            
        super().__init__(message)

class Guardian:
    """Ensures optimal resource allocation"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Guardian, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance
    
    def _initialize(self):
        """Initialize guardian"""
        self.resource_limits = defaultdict(lambda: defaultdict(int))
        self.usage_counters = defaultdict(lambda: defaultdict(list))
        
        # Define resource limits
        self.resource_limits["default"] = {"min": 60, "hour": 3000}
        self.resource_limits["TCBS"] = {"min": 60, "hour": 3000}
        self.resource_limits["VCI"] = {"min": 60, "hour": 3000}
        self.resource_limits["VCI.ext"] = {"min": 600, "hour": 36000}
        self.resource_limits["VND.ext"] = {"min": 600, "hour": 36000}
        self.resource_limits["CAF.ext"] = {"min": 600, "hour": 36000}
        self.resource_limits["SPL.ext"] = {"min": 600, "hour": 36000}
        self.resource_limits["VDS.ext"] = {"min": 600, "hour": 36000}
        self.resource_limits["FAD.ext"] = {"min": 600, "hour": 36000}
    
    def verify(self, operation_id, resource_type="default"):
        """Verify resource availability before operation"""
        current_time = time.time()
        
        # Get limits for this resource type (or use default)
        limits = self.resource_limits.get(resource_type, self.resource_limits["default"])
        
        # Check minute limit
        minute_cutoff = current_time - 60
        self.usage_counters[resource_type]["min"] = [
            t for t in self.usage_counters[resource_type]["min"] 
            if t > minute_cutoff
        ]
        
        minute_usage = len(self.usage_counters[resource_type]["min"])
        minute_exceeded = minute_usage >= limits["min"]
        
        if minute_exceeded:
            # Track limit check through metrics module
            from vnai.beam.metrics import collector
            collector.record(
                "rate_limit",
                {
                    "resource_type": resource_type,
                    "limit_type": "min",
                    "limit_value": limits["min"],
                    "current_usage": minute_usage,
                    "is_exceeded": True
                },
                priority="high"
            )
            # Raise custom exception with retry information
            raise RateLimitExceeded(
                resource_type=resource_type, 
                limit_type="min",
                current_usage=minute_usage,
                limit_value=limits["min"],
                retry_after=60 - (current_time % 60)  # Seconds until the minute rolls over
            )
            
        # Check hour limit
        hour_cutoff = current_time - 3600
        self.usage_counters[resource_type]["hour"] = [
            t for t in self.usage_counters[resource_type]["hour"] 
            if t > hour_cutoff
        ]
        
        hour_usage = len(self.usage_counters[resource_type]["hour"])
        hour_exceeded = hour_usage >= limits["hour"]
        
        # Track rate limit check
        from vnai.beam.metrics import collector
        collector.record(
            "rate_limit",
            {
                "resource_type": resource_type,
                "limit_type": "hour" if hour_exceeded else "min",
                "limit_value": limits["hour"] if hour_exceeded else limits["min"],
                "current_usage": hour_usage if hour_exceeded else minute_usage,
                "is_exceeded": hour_exceeded
            }
        )
        
        if hour_exceeded:
            # Raise custom exception with retry information
            raise RateLimitExceeded(
                resource_type=resource_type, 
                limit_type="hour",
                current_usage=hour_usage,
                limit_value=limits["hour"],
                retry_after=3600 - (current_time % 3600)  # Seconds until the hour rolls over
            )
            
        # Record this request
        self.usage_counters[resource_type]["min"].append(current_time)
        self.usage_counters[resource_type]["hour"].append(current_time)
        return True
    
    def usage(self, resource_type="default"):
        """Get current usage percentage for resource limits"""
        current_time = time.time()
        limits = self.resource_limits.get(resource_type, self.resource_limits["default"])
        
        # Clean old timestamps
        minute_cutoff = current_time - 60
        hour_cutoff = current_time - 3600
        
        self.usage_counters[resource_type]["min"] = [
            t for t in self.usage_counters[resource_type]["min"] 
            if t > minute_cutoff
        ]
        
        self.usage_counters[resource_type]["hour"] = [
            t for t in self.usage_counters[resource_type]["hour"] 
            if t > hour_cutoff
        ]
        
        # Calculate percentages
        minute_usage = len(self.usage_counters[resource_type]["min"])
        hour_usage = len(self.usage_counters[resource_type]["hour"])
        
        minute_percentage = (minute_usage / limits["min"]) * 100 if limits["min"] > 0 else 0
        hour_percentage = (hour_usage / limits["hour"]) * 100 if limits["hour"] > 0 else 0
        
        # Return the higher percentage
        return max(minute_percentage, hour_percentage)
    
    def get_limit_status(self, resource_type="default"):
        """Get detailed information about current limit status"""
        current_time = time.time()
        limits = self.resource_limits.get(resource_type, self.resource_limits["default"])
        
        # Clean old timestamps
        minute_cutoff = current_time - 60
        hour_cutoff = current_time - 3600
        
        minute_usage = len([t for t in self.usage_counters[resource_type]["min"] if t > minute_cutoff])
        hour_usage = len([t for t in self.usage_counters[resource_type]["hour"] if t > hour_cutoff])
        
        return {
            "resource_type": resource_type,
            "minute_limit": {
                "usage": minute_usage,
                "limit": limits["min"],
                "percentage": (minute_usage / limits["min"]) * 100 if limits["min"] > 0 else 0,
                "remaining": max(0, limits["min"] - minute_usage),
                "reset_in_seconds": 60 - (current_time % 60)
            },
            "hour_limit": {
                "usage": hour_usage,
                "limit": limits["hour"],
                "percentage": (hour_usage / limits["hour"]) * 100 if limits["hour"] > 0 else 0,
                "remaining": max(0, limits["hour"] - hour_usage),
                "reset_in_seconds": 3600 - (current_time % 3600)
            }
        }

# Create singleton instance
guardian = Guardian()

class CleanErrorContext:
    """Context manager to clean up tracebacks for rate limits"""
    # Class variable to track if a message has been displayed recently
    _last_message_time = 0
    _message_cooldown = 5  # Only show a message every 5 seconds
    
    def __enter__(self):
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is RateLimitExceeded:
            current_time = time.time()
            
            # Only print the message if enough time has passed since the last one
            if current_time - CleanErrorContext._last_message_time >= CleanErrorContext._message_cooldown:
                print(f"\n⚠️ {str(exc_val)}\n")
                CleanErrorContext._last_message_time = current_time
            
            # Re-raise the exception more forcefully to ensure it propagates
            # This will bypass any try/except blocks that might be catching RateLimitExceeded
            import sys
            sys.exit(f"Rate limit exceeded. {str(exc_val)} Process terminated.")
            
            # The line below won't be reached, but we keep it for clarity
            return False
        return False


def optimize(resource_type='default', loop_threshold=10, time_window=5, ad_cooldown=150, content_trigger_threshold=3, 
            max_retries=2, backoff_factor=2, debug=False):
    """
    Decorator that optimizes function execution, tracks metrics, and detects loop patterns for ad opportunities.
    
    Features:
    - Resource verification
    - Performance metrics collection
    - Loop detection for ad/content opportunities
    - Automatic retry with exponential backoff for rate limit errors
    
    Args:
        resource_type: Type of resource used by function ("network", "database", "cpu", "memory", "io", "default")
        loop_threshold: Number of calls within time_window to consider as a loop (min: 2)
        time_window: Time period in seconds to consider for loop detection
        ad_cooldown: Minimum seconds between showing ads for the same function
        content_trigger_threshold: Number of consecutive loop detections before triggering content (min: 1)
        max_retries: Maximum number of times to retry when rate limits are hit
        backoff_factor: Base factor for exponential backoff (wait time = backoff_factor^retry_count)
        debug: When True, prints diagnostic information about loop detection
    
    Examples:
        @optimize
        def simple_function():
            return "result"
            
        @optimize("network")
        def fetch_stock_data(symbol):
            # Makes network calls
            return data
            
        @optimize("database", loop_threshold=4, time_window=10)
        def query_financial_data(params):
            # Database queries
            return results
    """
    # Handle case where decorator is used without arguments: @optimize
    if callable(resource_type):
        func = resource_type
        return _create_wrapper(func, 'default', loop_threshold, time_window, ad_cooldown, content_trigger_threshold, 
                             max_retries, backoff_factor, debug)
    
    # Basic validation
    if loop_threshold < 2:
        raise ValueError(f"loop_threshold must be at least 2, got {loop_threshold}")
    if time_window <= 0:
        raise ValueError(f"time_window must be positive, got {time_window}")
    if content_trigger_threshold < 1:
        raise ValueError(f"content_trigger_threshold must be at least 1, got {content_trigger_threshold}")
    if max_retries < 0:
        raise ValueError(f"max_retries must be non-negative, got {max_retries}")
    if backoff_factor <= 0:
        raise ValueError(f"backoff_factor must be positive, got {backoff_factor}")
    
    # Return the actual decorator
    def decorator(func):
        return _create_wrapper(func, resource_type, loop_threshold, time_window, ad_cooldown, content_trigger_threshold, 
                             max_retries, backoff_factor, debug)
    return decorator

def _create_wrapper(func, resource_type, loop_threshold, time_window, ad_cooldown, content_trigger_threshold, 
                   max_retries, backoff_factor, debug):
    """Creates the function wrapper with call tracking for loop detection"""
    # Static storage for each decorated function instance
    call_history = []
    last_ad_time = 0
    consecutive_loop_detections = 0
    session_displayed = False  # Track if we've displayed an ad in this session
    session_start_time = time.time()
    session_timeout = 1800  # 30 minutes for session expiration
    
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        nonlocal last_ad_time, consecutive_loop_detections, session_displayed, session_start_time
        current_time = time.time()
        content_triggered = False
        
        # Reset session if it has expired
        if current_time - session_start_time > session_timeout:
            session_displayed = False
            session_start_time = current_time
            
        # For automatic retries with rate limits
        retries = 0
        while True:
            # ===== LOOP DETECTION LOGIC =====
            # Add current call to history
            call_history.append(current_time)
            
            # Prune old calls outside the time window
            while call_history and current_time - call_history[0] > time_window:
                call_history.pop(0)
            
            # Check if we're in a loop pattern
            loop_detected = len(call_history) >= loop_threshold
            
            if debug and loop_detected:
                print(f"[OPTIMIZE] Đã phát hiện vòng lặp cho {func.__name__}: {len(call_history)} lần gọi trong {time_window}s")
            
            # Handle loop detection
            if loop_detected:
                consecutive_loop_detections += 1
                if debug:
                    print(f"[OPTIMIZE] Số lần phát hiện vòng lặp liên tiếp: {consecutive_loop_detections}/{content_trigger_threshold}")
            else:
                consecutive_loop_detections = 0
            
            # Determine if we should show content - add session_displayed check
            should_show_content = (consecutive_loop_detections >= content_trigger_threshold) and \
                                 (current_time - last_ad_time >= ad_cooldown) and \
                                 not session_displayed
            
            # Handle content opportunity
            if should_show_content:
                last_ad_time = current_time
                consecutive_loop_detections = 0
                content_triggered = True
                session_displayed = True  # Mark that we've displayed in this session
                
                if debug:
                    print(f"[OPTIMIZE] Đã kích hoạt nội dung cho {func.__name__}")
                
                # Trigger content display using promo manager with "loop" context
                try:
                    from vnai.scope.promo import manager
                    
                    # Get environment if available
                    try:
                        from vnai.scope.profile import inspector
                        environment = inspector.examine().get("environment", None)
                        manager.present_content(environment=environment, context="loop")
                    except ImportError:
                        manager.present_content(context="loop")
                        
                except ImportError:
                    # Fallback if content manager is not available
                    print(f"Phát hiện vòng lặp: Hàm '{func.__name__}' đang được gọi trong một vòng lặp")
                except Exception as e:
                    # Don't let content errors affect the main function
                    if debug:
                        print(f"[OPTIMIZE] Lỗi khi hiển thị nội dung: {str(e)}")
            
            # ===== RESOURCE VERIFICATION =====
            try:
                # Use a context manager to clean up the traceback
                with CleanErrorContext():
                    guardian.verify(func.__name__, resource_type)
                    
            except RateLimitExceeded as e:
                # Record the rate limit error
                from vnai.beam.metrics import collector
                collector.record(
                    "error",
                    {
                        "function": func.__name__,
                        "error": str(e),
                        "context": "resource_verification",
                        "resource_type": resource_type,
                        "retry_attempt": retries
                    },
                    priority="high"
                )
                
                # Display rate limit content ONLY if we haven't shown any content this session
                if not session_displayed:
                    try:
                        from vnai.scope.promo import manager
                        try:
                            from vnai.scope.profile import inspector
                            environment = inspector.examine().get("environment", None)
                            manager.present_content(environment=environment, context="loop")
                            session_displayed = True  # Mark that we've displayed
                            last_ad_time = current_time
                        except ImportError:
                            manager.present_content(context="loop")
                            session_displayed = True
                            last_ad_time = current_time
                    except Exception:
                        pass  # Don't let content errors affect the retry logic
                
                # Continue with retry logic
                if retries < max_retries:
                    wait_time = backoff_factor ** retries
                    retries += 1
                    
                    # If the exception has a retry_after value, use that instead
                    if hasattr(e, "retry_after") and e.retry_after:
                        wait_time = min(wait_time, e.retry_after)
                    
                    if debug:
                        print(f"[OPTIMIZE] Đã đạt giới hạn tốc độ cho {func.__name__}, thử lại sau {wait_time} giây (lần thử {retries}/{max_retries})")
                    
                    time.sleep(wait_time)
                    continue  # Retry the call
                else:
                    # No more retries, re-raise the exception
                    raise
            
            # ===== FUNCTION EXECUTION & METRICS =====
            start_time = time.time()
            success = False
            error = None
            
            try:
                # Execute the original function
                result = func(*args, **kwargs)
                success = True
                return result
            except Exception as e:
                error = str(e)
                raise
            finally:
                # Calculate execution metrics
                execution_time = time.time() - start_time
                
                # Record metrics
                try:
                    from vnai.beam.metrics import collector
                    collector.record(
                        "function",
                        {
                            "function": func.__name__,
                            "resource_type": resource_type,
                            "execution_time": execution_time,
                            "success": success,
                            "error": error,
                            "in_loop": loop_detected,
                            "loop_depth": len(call_history),
                            "content_triggered": content_triggered,
                            "timestamp": datetime.now().isoformat(),
                            "retry_count": retries if retries > 0 else None
                        }
                    )
                    
                    # Record content opportunity metrics if detected
                    if content_triggered:
                        collector.record(
                            "ad_opportunity",
                            {
                                "function": func.__name__,
                                "resource_type": resource_type,
                                "call_frequency": len(call_history) / time_window,
                                "consecutive_loops": consecutive_loop_detections,
                                "timestamp": datetime.now().isoformat()
                            }
                        )
                except ImportError:
                    # Metrics module not available, just continue
                    pass
                
            # If we got here, the function executed successfully, so break the retry loop
            break
                
    return wrapper


# Helper function for getting the current rate limit status
def rate_limit_status(resource_type="default"):
    """Get the current rate limit status for a resource type"""
    return guardian.get_limit_status(resource_type)
