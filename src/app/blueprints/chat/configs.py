import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
CONFIGS_PATH = BASE_DIR / "configs.json"

configs = {
    "model": "deepseek-v4-pro",
    "success_status": 0,
    "failure_status": 1
}