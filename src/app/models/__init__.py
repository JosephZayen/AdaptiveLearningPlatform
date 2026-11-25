from sqlalchemy import create_engine
from base import Base
#方便导入
from .chat import ChatSession
from .event import Event
from .paper import Paper, Problem
from .textbook import Textbook, Chapter
from .user import User

def init_db(url="sqlite:///instance.sqlite"):
    """
    *Params*
        url: 需要URL转义，尤其是/，可以查阅unified tutorial create_engine部分
    """
    engine = create_engine(url, echo=True)
    Base.metadata.create_all(engine)

init_db()