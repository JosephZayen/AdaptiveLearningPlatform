from pathlib import Path

CONFIG_DIR = Path(__file__).parent
ROOT = CONFIG_DIR.parent
STATIC_FOLDER: Path = ROOT / "static/"
TEMPLATES_FOLDER: Path = ROOT / "templates"
