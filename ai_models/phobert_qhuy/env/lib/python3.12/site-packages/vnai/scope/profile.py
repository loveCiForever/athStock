# vnai/scope/profile.py
# System environment detection

import os
import sys
import platform
import uuid
import hashlib
import psutil
import threading
import time
import importlib.metadata
from datetime import datetime
import subprocess
from pathlib import Path

class Inspector:
    """Inspects execution environment"""
    
    _instance = None
    _lock = None
    
    def __new__(cls):
        import threading
        if cls._lock is None:
            cls._lock = threading.Lock()
            
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Inspector, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance
    
    def _initialize(self):
        """Initialize inspector"""
        self.cache = {}
        self.cache_ttl = 3600  # 1 hour cache validity
        self.last_examination = 0
        self.machine_id = None
        self._colab_auth_triggered = False
        
        # Paths
        self.home_dir = Path.home()
        self.project_dir = self.home_dir / ".vnstock"
        self.project_dir.mkdir(exist_ok=True)
        self.id_dir = self.project_dir / 'id'
        self.id_dir.mkdir(exist_ok=True)
        self.machine_id_path = self.id_dir / "machine_id.txt"
        
        # Perform initial examination
        self.examine()
    
    def examine(self, force_refresh=False):
        """Examine current execution context"""
        current_time = time.time()
        
        # Return cached data if it's fresh enough and we're not forcing a refresh
        if not force_refresh and (current_time - self.last_examination) < self.cache_ttl:
            return self.cache
            
        # Start with basic information
        info = {
            "timestamp": datetime.now().isoformat(),
            "python_version": platform.python_version(),
            "os_name": platform.system(),
            "platform": platform.platform()
        }
        
        # Machine identifier
        info["machine_id"] = self.fingerprint()
        
        # Environment detection
        try:
            # Check for Jupyter/IPython
            import importlib.util
            ipython_spec = importlib.util.find_spec("IPython")
            
            if ipython_spec:
                from IPython import get_ipython
                ipython = get_ipython()
                if ipython is not None:
                    info["environment"] = "jupyter"
                    # Check for hosted notebooks
                    if 'google.colab' in sys.modules:
                        info["hosting_service"] = "colab"
                    elif 'KAGGLE_KERNEL_RUN_TYPE' in os.environ:
                        info["hosting_service"] = "kaggle"
                    else:
                        info["hosting_service"] = "local_jupyter"
                elif sys.stdout.isatty():
                    info["environment"] = "terminal"
                else:
                    info["environment"] = "script"
            elif sys.stdout.isatty():
                info["environment"] = "terminal"
            else:
                info["environment"] = "script"
        except:
            info["environment"] = "unknown"
        
        # System resources
        try:
            info["cpu_count"] = os.cpu_count()
            info["memory_gb"] = round(psutil.virtual_memory().total / (1024**3), 1)
        except:
            pass
        
        # Check if in Google Colab
        is_colab = 'google.colab' in sys.modules
        if is_colab:
            info["is_colab"] = True
            # Setup delayed authentication if not already triggered
            self.detect_colab_with_delayed_auth()
        
        # Enhanced context information
        try:
            # Commercial usage detection
            info["commercial_usage"] = self.enhanced_commercial_detection()
            
            # Project context
            info["project_context"] = self.analyze_project_structure()
            
            # Git info
            info["git_info"] = self.analyze_git_info()
            
            # Working hours pattern
            info["usage_pattern"] = self.detect_usage_pattern()
            
            # Dependency analysis
            info["dependencies"] = self.analyze_dependencies()
        except Exception as e:
            # Don't let enhanced detection failure stop basic functionality
            info["detection_error"] = str(e)
        
        # Update cache
        self.cache = info
        self.last_examination = current_time
        
        return info
    
    def fingerprint(self):
        """Generate unique environment fingerprint"""
        # Always return cached machine_id if it exists
        if self.machine_id:
            return self.machine_id
                
        # Try to load from file first
        if self.machine_id_path.exists():
            try:
                with open(self.machine_id_path, "r") as f:
                    self.machine_id = f.read().strip()
                    return self.machine_id
            except:
                pass
        
        # Check for Colab and setup delayed authentication
        is_colab = self.detect_colab_with_delayed_auth()
                    
        # Generate a new machine ID only if necessary
        try:
            # Use consistent system information
            system_info = platform.node() + platform.platform() + platform.machine()
            self.machine_id = hashlib.md5(system_info.encode()).hexdigest()
        except:
            # Fallback to UUID but only as last resort
            self.machine_id = str(uuid.uuid4())
                
        # Save to ensure consistency across calls
        try:
            with open(self.machine_id_path, "w") as f:
                f.write(self.machine_id)
        except:
            pass
                
        return self.machine_id
    
    def detect_hosting(self):
        """Detect if running in a hosted environment"""
        # Check common environment variables for hosted environments
        hosting_markers = {
            "COLAB_GPU": "Google Colab",
            "KAGGLE_KERNEL_RUN_TYPE": "Kaggle",
            "BINDER_SERVICE_HOST": "Binder",
            "CODESPACE_NAME": "GitHub Codespaces",
            "STREAMLIT_SERVER_HEADLESS": "Streamlit Cloud",
            "CLOUD_SHELL": "Cloud Shell"
        }
        
        for env_var, host_name in hosting_markers.items():
            if env_var in os.environ:
                return host_name
                
        # Check for Google Colab module
        if 'google.colab' in sys.modules:
            return "Google Colab"
            
        return "local"
    
    def detect_commercial_usage(self):
        """Detect if running in commercial environment"""
        commercial_indicators = {
            "env_domains": [".com", ".io", ".co", "enterprise", "corp", "inc"],
            "file_patterns": ["invoice", "payment", "customer", "client", "product", "sale"],
            "env_vars": ["COMPANY", "BUSINESS", "ENTERPRISE", "CORPORATE"],
            "dir_patterns": ["company", "business", "enterprise", "corporate", "client"]
        }
        
        # Check environment variables for commercial domains
        env_values = " ".join(os.environ.values()).lower()
        domain_match = any(domain in env_values for domain in commercial_indicators["env_domains"])
        
        # Check if commercial-related environment variables exist
        env_var_match = any(var in os.environ for var in commercial_indicators["env_vars"])
        
        # Check current directory for commercial indicators
        current_dir = os.getcwd().lower()
        dir_match = any(pattern in current_dir for pattern in commercial_indicators["dir_patterns"])
        
        # Check files in current directory for commercial patterns
        try:
            files = [f.lower() for f in os.listdir() if os.path.isfile(f)]
            file_match = any(any(pattern in f for pattern in commercial_indicators["file_patterns"]) for f in files)
        except:
            file_match = False
        
        # Calculate probability
        indicators = [domain_match, env_var_match, dir_match, file_match]
        commercial_probability = sum(indicators) / len(indicators)
        
        return {
            "likely_commercial": commercial_probability > 0.3,
            "commercial_probability": commercial_probability,
            "commercial_indicators": {
                "domain_match": domain_match,
                "env_var_match": env_var_match,
                "dir_match": dir_match,
                "file_match": file_match
            }
        }
    
    def scan_packages(self):
        """Scan for installed packages by category"""
        package_groups = {
            "vnstock_family": [
                "vnstock", 
                "vnstock3", 
                "vnstock_ezchart", 
                "vnstock_data_pro",  # Fixed missing comma here
                "vnstock_market_data_pipeline", 
                "vnstock_ta", 
                "vnii", 
                "vnai"
            ],
            "analytics": [
                "openbb",
                "pandas_ta"
            ],
            "static_charts": [
                "matplotlib",
                "seaborn",
                "altair"
            ],
            "dashboard": [
                "streamlit",
                "voila",
                "panel",
                "shiny",
                "dash"
            ],
            "interactive_charts": [
                "mplfinance",
                "plotly",
                "plotline",
                "bokeh",
                "pyecharts",
                "highcharts-core",
                "highcharts-stock",
                "mplchart"
            ],
            "datafeed": [
                "yfinance",
                "alpha_vantage",
                "pandas-datareader",
                "investpy"
            ],
            "official_api": [
                "ssi-fc-data",
                "ssi-fctrading"
            ],
            "risk_return": [
                "pyfolio",
                "empyrical",
                "quantstats",
                "financetoolkit"
            ],
            "machine_learning": [
                "scipy",
                "sklearn",
                "statsmodels",
                "pytorch",
                "tensorflow",
                "keras",
                "xgboost"
            ],
            "indicators": [
                "stochastic",
                "talib",
                "tqdm",
                "finta",
                "financetoolkit",
                "tulipindicators"
            ],
            "backtesting": [
                "vectorbt",
                "backtesting",
                "bt",
                "zipline",
                "pyalgotrade",
                "backtrader",
                "pybacktest",
                "fastquant",
                "lean",
                "ta",
                "finmarketpy",
                "qstrader"
            ],
            "server": [
                "fastapi",
                "flask",
                "uvicorn",
                "gunicorn"
            ],
            "framework": [
                "lightgbm",
                "catboost",
                "django"
            ]
        }
        
        installed = {}
        
        for category, packages in package_groups.items():
            installed[category] = []
            for pkg in packages:
                try:
                    version = importlib.metadata.version(pkg)
                    installed[category].append({"name": pkg, "version": version})
                except:
                    pass
        
        return installed
    
    def setup_vnstock_environment(self):
        """Set up environment for vnstock library"""
        # Create environment.json file
        env_file = self.id_dir / "environment.json"
        env_data = {
            "accepted_agreement": True,
            "timestamp": datetime.now().isoformat(),
            "machine_id": self.fingerprint()
        }
        
        try:
            with open(env_file, "w") as f:
                import json
                json.dump(env_data, f)
            return True
        except Exception as e:
            print(f"Failed to set up vnstock environment: {e}")
            return False

    # Update detect_colab_with_delayed_auth method in Inspector class
    def detect_colab_with_delayed_auth(self, immediate=False):
        """Detect if running in Google Colab and setup authentication"""
        # Check if we're in Colab without mounting drive yet
        is_colab = 'google.colab' in sys.modules
        
        if is_colab and not self._colab_auth_triggered:
            if immediate:
                # Immediate authentication
                self._colab_auth_triggered = True
                user_id = self.get_or_create_user_id()
                if user_id and user_id != self.machine_id:
                    self.machine_id = user_id
                    try:
                        with open(self.machine_id_path, "w") as f:
                            f.write(user_id)
                    except:
                        pass
            else:
                # Start a delayed thread to trigger authentication after user is already using the package
                def delayed_auth():
                    # Wait for some time (e.g., 5 minutes) before attempting auth
                    time.sleep(300)
                    # Try to get authenticated user ID
                    user_id = self.get_or_create_user_id()
                    # Update machine ID with the authenticated one
                    if user_id and user_id != self.machine_id:
                        self.machine_id = user_id
                        # Save to the machine_id_path
                        try:
                            with open(self.machine_id_path, "w") as f:
                                f.write(user_id)
                        except:
                            pass
                
                # Start the delayed authentication thread
                thread = threading.Thread(target=delayed_auth, daemon=True)
                thread.start()
        
        return is_colab

    def get_or_create_user_id(self):
        """Get existing user ID from Google Drive or create new one"""
        if self._colab_auth_triggered:
            return self.machine_id  # Avoid triggering multiple times
            
        try:
            from google.colab import drive
            print("\n📋 Kết nối tài khoản Google Drive để lưu các thiết lập của dự án.")
            print("Dữ liệu phiên làm việc với Colab của bạn sẽ bị xóa nếu không lưu trữ vào Google Drive.\n")
            
            # Mark that we've triggered the auth
            self._colab_auth_triggered = True
            
            # Mount Google Drive
            drive.mount('/content/drive')
            id_path = '/content/drive/MyDrive/.vnstock/user_id.txt'

            if os.path.exists(id_path):
                with open(id_path, 'r') as f:
                    return f.read().strip()
            else:
                user_id = str(uuid.uuid4())
                os.makedirs(os.path.dirname(id_path), exist_ok=True)
                with open(id_path, 'w') as f:
                    f.write(user_id)
                return user_id
        except Exception as e:
            # Silently fail and return the existing machine ID
            return self.machine_id
    
    # Enhanced methods for project context collection
    
    def analyze_project_structure(self):
        """Analyze project directory structure for context"""
        current_dir = os.getcwd()
        project_indicators = {
            "commercial_app": ["app", "services", "products", "customers", "billing"],
            "financial_tool": ["portfolio", "backtesting", "trading", "strategy"],
            "data_science": ["models", "notebooks", "datasets", "visualization"],
            "educational": ["examples", "lectures", "assignments", "slides"]
        }
        
        # Look for key directories up to 2 levels deep (limited for privacy)
        project_type = {}
        for category, markers in project_indicators.items():
            match_count = 0
            for marker in markers:
                if os.path.exists(os.path.join(current_dir, marker)):
                    match_count += 1
            if len(markers) > 0:
                project_type[category] = match_count / len(markers)
        
        # Scan for direct child files and directories (limited depth for privacy)
        try:
            root_files = [f for f in os.listdir(current_dir) if os.path.isfile(os.path.join(current_dir, f))]
            root_dirs = [d for d in os.listdir(current_dir) if os.path.isdir(os.path.join(current_dir, d))]
            
            # Detect project type
            file_markers = {
                "python_project": ["setup.py", "pyproject.toml", "requirements.txt"],
                "data_science": ["notebook.ipynb", ".ipynb_checkpoints"],
                "web_app": ["app.py", "wsgi.py", "manage.py", "server.py"],
                "finance_app": ["portfolio.py", "trading.py", "backtest.py"],
            }
            
            file_project_type = "unknown"
            for ptype, markers in file_markers.items():
                if any(marker in root_files for marker in markers):
                    file_project_type = ptype
                    break
                    
            # Scan for specific frameworks
            frameworks = []
            framework_markers = {
                "django": ["manage.py", "settings.py"],
                "flask": ["app.py", "wsgi.py"],
                "streamlit": ["streamlit_app.py", "app.py"],
                "fastapi": ["main.py", "app.py"],
            }
            
            for framework, markers in framework_markers.items():
                if any(marker in root_files for marker in markers):
                    frameworks.append(framework)
                    
        except Exception as e:
            root_files = []
            root_dirs = []
            file_project_type = "unknown"
            frameworks = []
        
        return {
            "project_dir": current_dir,
            "detected_type": max(project_type.items(), key=lambda x: x[1])[0] if project_type else "unknown",
            "file_type": file_project_type,
            "is_git_repo": ".git" in (root_dirs if 'root_dirs' in locals() else []),
            "frameworks": frameworks,
            "file_count": len(root_files) if 'root_files' in locals() else 0,
            "directory_count": len(root_dirs) if 'root_dirs' in locals() else 0,
            "type_confidence": project_type
        }

    def analyze_git_info(self):
        """Extract non-sensitive git repository information"""
        try:
            # Check if it's a git repository
            result = subprocess.run(["git", "rev-parse", "--is-inside-work-tree"], 
                                capture_output=True, text=True)
            
            if result.returncode != 0:
                return {"has_git": False}
            
            # Get repository root path - ADD THIS CODE
            repo_root = subprocess.run(["git", "rev-parse", "--show-toplevel"], 
                                    capture_output=True, text=True)
            repo_path = repo_root.stdout.strip() if repo_root.stdout else None
            
            # Extract repository name from path - ADD THIS CODE
            repo_name = os.path.basename(repo_path) if repo_path else None
            
            # Check for license file - ADD THIS CODE
            has_license = False
            license_type = "unknown"
            if repo_path:
                license_files = [
                    os.path.join(repo_path, "LICENSE"),
                    os.path.join(repo_path, "LICENSE.txt"),
                    os.path.join(repo_path, "LICENSE.md")
                ]
                for license_file in license_files:
                    if os.path.exists(license_file):
                        has_license = True
                        # Try to determine license type by scanning content
                        try:
                            with open(license_file, 'r') as f:
                                content = f.read().lower()
                                if "mit license" in content:
                                    license_type = "MIT"
                                elif "apache license" in content:
                                    license_type = "Apache"
                                elif "gnu general public" in content:
                                    license_type = "GPL"
                                elif "bsd " in content:
                                    license_type = "BSD"
                                # Add more license type detection as needed
                        except:
                            pass
                        break
                
            # Get remote URL (only domain, not full URL)
            remote = subprocess.run(["git", "config", "--get", "remote.origin.url"], 
                                capture_output=True, text=True)
            
            remote_url = remote.stdout.strip() if remote.stdout else None
            
            if remote_url:
                # Clean the remote URL string
                remote_url = remote_url.strip()
                
                # Properly extract domain without authentication information
                domain = None
                if remote_url:
                    # For SSH URLs (git@github.com:user/repo.git)
                    if remote_url.startswith('git@') or '@' in remote_url and ':' in remote_url.split('@')[1]:
                        domain = remote_url.split('@')[1].split(':')[0]
                    # For HTTPS URLs with or without authentication
                    elif remote_url.startswith('http'):
                        # Remove authentication part if present
                        url_parts = remote_url.split('//')
                        if len(url_parts) > 1:
                            auth_and_domain = url_parts[1].split('/', 1)[0]
                            # If auth info exists (contains @), take only domain part
                            if '@' in auth_and_domain:
                                domain = auth_and_domain.split('@')[-1]
                            else:
                                domain = auth_and_domain
                    # Handle other URL formats
                    else:
                        # Try a general regex as fallback for unusual formats
                        import re
                        domain_match = re.search(r'@([^:/]+)|https?://(?:[^@/]+@)?([^/]+)', remote_url)
                        if domain_match:
                            domain = domain_match.group(1) or domain_match.group(2)
                
                # Extract owner and repo info securely
                owner = None
                repo_name = None
                
                if domain:
                    # For GitHub repositories
                    if "github" in domain:
                        # SSH format: git@github.com:username/repo.git
                        if ':' in remote_url and '@' in remote_url:
                            parts = remote_url.split(':')[-1].split('/')
                            if len(parts) >= 2:
                                owner = parts[0]
                                repo_name = parts[1].replace('.git', '')
                        # HTTPS format
                        else:
                            url_parts = remote_url.split('//')
                            if len(url_parts) > 1:
                                path_parts = url_parts[1].split('/')
                                if len(path_parts) >= 3:
                                    # Skip domain and authentication part
                                    domain_part = path_parts[0]
                                    if '@' in domain_part:
                                        # Path starts after domain
                                        owner_index = 1
                                    else:
                                        owner_index = 1
                                    
                                    if len(path_parts) > owner_index:
                                        owner = path_parts[owner_index]
                                    if len(path_parts) > owner_index + 1:
                                        repo_name = path_parts[owner_index + 1].replace('.git', '')
                
                # Get commit count
                commit_count = subprocess.run(["git", "rev-list", "--count", "HEAD"], 
                                        capture_output=True, text=True)
                
                # Get branch count
                branch_count = subprocess.run(["git", "branch", "--list"], 
                                        capture_output=True, text=True)
                branch_count = len(branch_count.stdout.strip().split('\n')) if branch_count.stdout else 0
                                        
                return {
                    "domain": domain,  # Only domain, not full URL
                    "owner": owner,    # Repository owner (for GitHub)
                    "commit_count": int(commit_count.stdout.strip()) if commit_count.stdout else 0,
                    "branch_count": branch_count,
                    "has_git": True,
                    "repo_path": repo_path if 'repo_path' in locals() else None,
                    "repo_name": repo_name,
                    "has_license": has_license if 'has_license' in locals() else False,
                    "license_type": license_type if 'license_type' in locals() else "unknown"
                }

        except Exception as e:
            # Optionally log the exception for debugging
            pass
        return {"has_git": False}

    def detect_usage_pattern(self):
        """Detect usage patterns that indicate commercial use"""
        current_time = datetime.now()
        
        # Check if using during business hours
        is_weekday = current_time.weekday() < 5  # 0-4 are Monday to Friday
        hour = current_time.hour
        is_business_hours = 9 <= hour <= 18
        
        return {
            "business_hours_usage": is_weekday and is_business_hours,
            "weekday": is_weekday,
            "hour": hour,
            "timestamp": current_time.isoformat()
        }

    def enhanced_commercial_detection(self):
        """More thorough commercial usage detection"""
        basic = self.detect_commercial_usage()
        
        # Additional commercial indicators
        try:
            project_files = os.listdir(os.getcwd())
            
            # Look for commercial frameworks
            commercial_frameworks = ["django-oscar", "opencart", "magento", 
                                   "saleor", "odoo", "shopify", "woocommerce"]
            
            framework_match = False
            for framework in commercial_frameworks:
                if any(framework in f for f in project_files):
                    framework_match = True
                    break
            
            # Check for database connections
            db_files = [f for f in project_files if "database" in f.lower() 
                      or "db_config" in f.lower() or f.endswith(".db")]
            has_database = len(db_files) > 0
        except:
            framework_match = False
            has_database = False
        
        # Domain name registration check
        domain_check = self.analyze_git_info()
        domain_is_commercial = False
        if domain_check and domain_check.get("domain"):
            commercial_tlds = [".com", ".io", ".co", ".org", ".net"]
            domain_is_commercial = any(tld in domain_check["domain"] for tld in commercial_tlds)
        
        # Check project structure
        project_structure = self.analyze_project_structure()
        
        # Calculate enhanced commercial score
        indicators = [
            basic["commercial_probability"],
            framework_match,
            has_database,
            domain_is_commercial,
            project_structure.get("type_confidence", {}).get("commercial_app", 0),
            self.detect_usage_pattern()["business_hours_usage"]
        ]
        
        # Filter out None values
        indicators = [i for i in indicators if i is not None]
        
        # Calculate score - convert booleans to 1.0 and average
        if indicators:
            score = sum(1.0 if isinstance(i, bool) and i else (i if isinstance(i, (int, float)) else 0) 
                      for i in indicators) / len(indicators)
        else:
            score = 0
        
        return {
            "commercial_probability": score,
            "likely_commercial": score > 0.4,
            "indicators": {
                "basic_indicators": basic["commercial_indicators"],
                "framework_match": framework_match,
                "has_database": has_database,
                "domain_is_commercial": domain_is_commercial,
                "project_structure": project_structure.get("detected_type"),
                "business_hours_usage": self.detect_usage_pattern()["business_hours_usage"]
            }
        }

    def analyze_dependencies(self):
        """Analyze package dependencies for commercial patterns"""
        try:
            import pkg_resources
            
            # Commercial/enterprise package indicators
            enterprise_packages = [
                "snowflake-connector-python", "databricks", "azure", 
                "aws", "google-cloud", "stripe", "atlassian",
                "salesforce", "bigquery", "tableau", "sap"
            ]
            
            # Find installed packages that match enterprise indicators
            commercial_deps = []
            for pkg in pkg_resources.working_set:
                if any(ent in pkg.key for ent in enterprise_packages):
                    commercial_deps.append({"name": pkg.key, "version": pkg.version})
            
            return {
                "has_commercial_deps": len(commercial_deps) > 0,
                "commercial_deps_count": len(commercial_deps),
                "commercial_deps": commercial_deps
            }
        except:
            return {"has_commercial_deps": False}

# Create singleton instance
inspector = Inspector()
