from sqlalchemy import ForeignKey, create_engine, select
from sqlalchemy.orm import DeclarativeBase, mapped_column, relationship, Mapped, Session
from typing import List, Optional

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ =  "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    pwd_hash: Mapped[str]
    custom_id: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]
    events: Mapped[List["Event"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan"
    )
    chat_sessions: Mapped[List["ChatSession"]] = relationship(
        back_populates="owner", 
        cascade="all, delete-orphan"
    )
    papers: Mapped[List["Paper"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan"
    )


class Event(Base):
    __tablename__ = "event"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    timestamp: Mapped[int] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    local_date: Mapped[str] = mapped_column(nullable=False)
    owner: Mapped["User"] = relationship(
        back_populates="events"
    )
    

class ChatSession(Base):
    __tablename__ = "chat_session"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="chat_sessions")
    local_date: Mapped[Optional[str]]
    json_data: Mapped[Optional[str]]
    problem_id: Mapped[Optional[int]] = mapped_column(unique=True)
    problem: Mapped["Problem"] = relationship(
        back_populates="session"
    )




class Paper(Base):
    __tablename__ = "paper"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    completeness: Mapped[Optional[float]] = mapped_column(default=0)
    grade: Mapped[Optional[int]] = mapped_column(default=0)
    owner: Mapped["User"] = relationship(
        back_populates="papers"
    )
    problems: Mapped[List["Problem"]] = relationship(
        back_populates="paper",
        cascade="all, delete-orphan"
    )


class Problem(Base):
    __tablename__ = "problem"

    # proxy keys
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("paper.id"))
    # ORM layer
    paper: Mapped["Paper"] = relationship(
        back_populates="problems"
    )
    # optional session
    session: Mapped["ChatSession"] = relationship(
        back_populates="problem",
        cascade="all, delete-orphan"
    )

    # natural keys

    # 题目内容
    problem_content: Mapped[str]
    answer: Mapped[Optional[str]]
    feedback: Mapped[Optional[str]]
    # 评分依据与评分结果
    reference_answer: Mapped[Optional[str]]
    scoring_criteria: Mapped[str]
    max_score: Mapped[int]
    grade: Mapped[Optional[int]] = mapped_column(default=None)
    # 元数据
    order: Mapped[int]
    checked: Mapped[bool] = mapped_column(default=False)
    on_progress: Mapped[bool] = mapped_column(default=False)









engine = create_engine("sqlite:///instance.sqlite", echo=True)
Base.metadata.create_all(engine)



















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
"""