from flask import Blueprint

calendar_bp = Blueprint("calendar_bp",__name__,url_prefix="/personalSpace",static_folder="static",template_folder="templates")

from . import calendar