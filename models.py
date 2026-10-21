from sqlalchemy import ForeignKey, create_engine, select
from sqlalchemy.orm import DeclarativeBase, mapped_column, relationship, Mapped, Session
from typing import List, Optional

# Base model and user class

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ =  "user"
    id: Mapped[int] = mapped_column(primary_key = True, autoincrement = True)
    pwd_hash: Mapped[str]
    custom_id: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]
    events: Mapped[List["Event"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )
    chat_sessions: Mapped[List["ChatSession"]] = relationship(
        back_populates="user", 
        cascade="all, delete-orphan"
    )

# modules

class Event(Base):
    __tablename__ = "event"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    timestamp: Mapped[int]
    description: Mapped[str]
    local_date: Mapped[str]
    user: Mapped[Optional["User"]] = relationship(
        back_populates="events"
    )
    
"""
# for storing files stuff
class WorkSpace(Base):   
    pass

class SM2(Base):
    pass

class RegSM2(Base):
    pass

class ErrorSM2(Base):
    pass
"""

"""
笔记：

back_populates解决的是双向同步问题，比如
event.user = usr1;
那么如果没写，usr1.events里面就不会同步增加这个外键关联的event
但是如果写了，它就会同步

类似于单相思和双相思的区别
"""

class ChatSession(Base):
    __tablename__ = "chat-session"
    id: Mapped[Optional[int]] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped[Optional["User"]] = relationship(back_populates="chat_sessions")
    local_date: Mapped[Optional[str]]
    json_data: Mapped[Optional[str]]




engine = create_engine("sqlite:///instance.sqlite")
Base.metadata.create_all(engine)
db_session = Session(engine)