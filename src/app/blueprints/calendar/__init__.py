from flask import Blueprint
from config.project_path import STATIC_FOLDER, TEMPLATES_FOLDER


calendar_bp = Blueprint("calendar_bp",__name__,url_prefix="/calendar",static_folder= str(STATIC_FOLDER.resolve()),template_folder=str(TEMPLATES_FOLDER.resolve()))

from .calendar import calendar