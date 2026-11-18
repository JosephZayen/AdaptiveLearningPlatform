from flask import Blueprint
from config.project_path import STATIC_FOLDER, TEMPLATES_FOLDER


calendar_bp = Blueprint("calendar_bp",__name__,url_prefix="/calendar",static_folder= STATIC_FOLDER,template_folder=TEMPLATES_FOLDER)

from .calendar import calendar