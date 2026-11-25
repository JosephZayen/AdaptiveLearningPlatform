from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, relationship, Mapped
from typing import List, Optional, TYPE_CHECKING
from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .paper import Problem

class ChatSession(Base):
    __tablename__ = "chat_session"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="chat_sessions")
    local_date: Mapped[Optional[str]]
    json_data: Mapped[Optional[str]]
    problem_id: Mapped[Optional[int]] = mapped_column(ForeignKey("problem.id"), unique=True)
    problem: Mapped["Problem"] = relationship(
        back_populates="session"
    )