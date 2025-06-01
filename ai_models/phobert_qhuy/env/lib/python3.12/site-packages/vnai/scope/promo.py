"""
Promo module for vnai: fetches and presents promotional content periodically or on demand,
using logging instead of printing to avoid polluting stdout for AI tools.
"""
import logging
import requests
from datetime import datetime
import random
import threading
import time
import urllib.parse

# Module-level logger setup
logger = logging.getLogger(__name__)
if not logger.hasHandlers():
    # Add a simple stream handler that only outputs the message text
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

class ContentManager:
    """
    Singleton manager to fetch remote or fallback promotional content and
    present it in different environments (Jupyter, terminal, other).

    Displays content automatically at randomized intervals via a background thread.
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        """
        Ensure only one instance of ContentManager is created (thread-safe).
        """
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(ContentManager, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance

    def _initialize(self):
        """
        Internal initializer: sets up display timing, URLs, and starts the periodic display thread.
        """
        # Timestamp of last content display (epoch seconds)
        self.last_display = 0
        # Minimum interval between displays (24 hours)
        self.display_interval = 24 * 3600

        # Base endpoints for fetching remote content and linking
        self.content_base_url = "https://vnstock-beam.hf.space/content-delivery"
        self.target_url = "https://vnstocks.com/lp-khoa-hoc-python-chung-khoan"
        self.image_url = (
            "https://vnstocks.com/img/trang-chu-vnstock-python-api-phan-tich-giao-dich-chung-khoan.jpg"
        )

        # Launch the background thread to periodically present content
        self._start_periodic_display()

    def _start_periodic_display(self):
        """
        Launch a daemon thread that sleeps a random duration between 2–6 hours,
        then checks if the display interval has elapsed and calls present_content.
        """
        def periodic_display():
            while True:
                # Randomize sleep to avoid synchronized requests across instances
                sleep_time = random.randint(2 * 3600, 6 * 3600)
                time.sleep(sleep_time)

                # Present content if enough time has passed since last_display
                current_time = time.time()
                if current_time - self.last_display >= self.display_interval:
                    self.present_content(context="periodic")

        thread = threading.Thread(target=periodic_display, daemon=True)
        thread.start()

    def fetch_remote_content(self, context: str = "init", html: bool = True) -> str:
        """
        Fetch promotional content from remote service with context and format flag.

        Args:
            context: usage context (e.g., "init", "periodic", "loop").
            html: if True, request HTML; otherwise plain text.

        Returns:
            The content string on HTTP 200, or None on failure.
        """
        try:
            # Build query params and URL
            params = {"context": context, "html": "true" if html else "false"}
            url = f"{self.content_base_url}?{urllib.parse.urlencode(params)}"

            response = requests.get(url, timeout=3)
            if response.status_code == 200:
                return response.text
            # Log non-200 responses at debug level
            logger.debug(f"Non-200 response fetching content: {response.status_code}")
            return None
        except Exception as e:
            # Log exceptions without interrupting user code
            logger.debug(f"Failed to fetch remote content: {e}")
            return None

    def present_content(self, environment: str = None, context: str = "init") -> None:
        """
        Present content according to the detected environment:
        - In Jupyter: use display(HTML or Markdown).
        - In terminal or other: log via logger.info().

        Args:
            environment: override detected environment ("jupyter", "terminal", else).
            context: same context flag passed to fetch_remote_content and fallback logic.
        """
        # Update last display timestamp
        self.last_display = time.time()

        # Auto-detect environment if not provided
        if environment is None:
            try:
                from vnai.scope.profile import inspector
                environment = inspector.examine().get("environment", "unknown")
            except Exception:
                environment = "unknown"

        # Retrieve remote or HTML/text content based on environment
        remote_content = self.fetch_remote_content(
            context=context, html=(environment == "jupyter")
        )
        # Generate fallback messages if remote fetch fails
        fallback = self._generate_fallback_content(context)

        if environment == "jupyter":
            # Rich display in Jupyter notebooks
            try:
                from IPython.display import display, HTML, Markdown

                if remote_content:
                    display(HTML(remote_content))
                else:
                    # Try Markdown, fallback to HTML
                    try:
                        display(Markdown(fallback["markdown"]))
                    except Exception:
                        display(HTML(fallback["html"]))
            except Exception as e:
                logger.debug(f"Jupyter display failed: {e}")

        elif environment == "terminal":
            # Log terminal-friendly or raw content via logger
            if remote_content:
                logger.info(remote_content)
            else:
                logger.info(fallback["terminal"])

        else:
            # Generic simple message for other environments
            logger.info(fallback["simple"])

    def _generate_fallback_content(self, context):
        fallback = {"html": "", "markdown": "", "terminal": "", "simple": ""}

        if context == "loop":
            fallback["html"] = (
                f"""
            <div style="border: 1px solid #e74c3c; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <h3 style="color: #e74c3c;">⚠️ Bạn đang sử dụng vòng lặp với quá nhiều requests</h3>
                <p>Để tránh bị giới hạn tốc độ và tối ưu hiệu suất:</p>
                <ul>
                    <li>Thêm thời gian chờ giữa các lần gọi API</li>
                    <li>Sử dụng xử lý theo batch thay vì lặp liên tục</li>
                    <li>Tham gia gói tài trợ <a href="https://vnstocks.com/insiders-program" style="color: #3498db;">Vnstock Insider</a> để tăng 5X giới hạn API</li>
                </ul>
            </div>
            """
            )
            fallback["markdown"] = (
                """
## ⚠️ Bạn đang sử dụng vòng lặp với quá nhiều requests

Để tránh bị giới hạn tốc độ và tối ưu hiệu suất:
* Thêm thời gian chờ giữa các lần gọi API
* Sử dụng xử lý theo batch thay vì lặp liên tục
* Tham gia gói tài trợ [Vnstock Insider](https://vnstocks.com/insiders-program) để tăng 5X giới hạn API
            """
            )
            fallback["terminal"] = (
                """
╔═════════════════════════════════════════════════════════════════╗
║                                                                 ║
║   🚫 ĐANG BỊ CHẶN BỞI GIỚI HẠN API? GIẢI PHÁP Ở ĐÂY!            ║
║                                                                 ║
║   ✓ Tăng ngay 500% tốc độ gọi API - Không còn lỗi RateLimit     ║
║   ✓ Tiết kiệm 85% thời gian chờ đợi giữa các request            ║
║                                                                 ║
║   ➤ NÂNG CẤP NGAY VỚI GÓI TÀI TRỢ VNSTOCK:                      ║
║     https://vnstocks.com/insiders-program                       ║
║                                                                 ║
╚═════════════════════════════════════════════════════════════════╝
                """
            )
            fallback["simple"] = (
                "🚫 Đang bị giới hạn API? Tăng tốc độ gọi API lên 500% với gói "
                "Vnstock Insider: https://vnstocks.com/insiders-program"
            )
        else:
            fallback["html"] = (
                f"""
            <div style="border: 1px solid #3498db; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <h3 style="color: #3498db;">👋 Chào mừng bạn đến với Vnstock!</h3>
                <p>Cảm ơn bạn đã sử dụng thư viện phân tích chứng khoán #1 tại Việt Nam cho Python</p>
                <ul>
                    <li>Tài liệu: <a href="https://vnstocks.com/docs/category/s%E1%BB%95-tay-h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn" style="color: #3498db;">vnstocks.com/docs</a></li>
                    <li>Cộng đồng: <a href="https://www.facebook.com/groups/vnstock.official" style="color: #3498db;">vnstocks.com/community</a></li>
                </ul>
                <p>Khám phá các tính năng mới nhất và tham gia cộng đồng để nhận hỗ trợ.</p>
            </div>
            """
            )
            fallback["markdown"] = (
                """
## 👋 Chào mừng bạn đến với Vnstock!

Cảm ơn bạn đã sử dụng package phân tích chứng khoán #1 tại Việt Nam

* Tài liệu: [Sổ tay hướng dẫn](https://vnstocks.com/docs/category/s%E1%BB%95-tay-h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn)
* Cộng đồng: [Nhóm Facebook](https://www.facebook.com/groups/vnstock.official)

Khám phá các tính năng mới nhất và tham gia cộng đồng để nhận hỗ trợ.
                """
            )
            fallback["terminal"] = (
                """
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║  👋 Chào mừng bạn đến với Vnstock!                       ║
║                                                          ║
║  Cảm ơn bạn đã sử dụng package phân tích                 ║
║  chứng khoán #1 tại Việt Nam                             ║
║                                                          ║
║  ✓ Tài liệu: https://vnstocks.com/docs/category/s%E1%BB%95-tay-h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn             ║
║  ✓ Cộng đồng: https://www.facebook.com/groups/vnstock.official             ║
║                                                          ║
║  Khám phá các tính năng mới nhất và tham gia             ║
║  cộng đồng để nhận hỗ trợ.                               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
                """
            )
            fallback["simple"] = (
                "👋 Chào mừng bạn đến với Vnstock! "
                "Tài liệu: https://vnstocks.com/docs/tai-lieu/huong-dan-nhanh | "
                "Cộng đồng: https://www.facebook.com/groups/vnstock.official"
            )
        return fallback

# Singleton instance for module-level use
manager = ContentManager()


def present(context: str = "init") -> None:
    """
    Shortcut to ContentManager.present_content for external callers.

    Args:
        context: propagate context string to ContentManager.
    """
    return manager.present_content(context=context)
