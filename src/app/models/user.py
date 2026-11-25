from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, relationship, Mapped
from typing import List, Optional
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .event import Event
    from .paper import Paper
    from .chat import ChatSession

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