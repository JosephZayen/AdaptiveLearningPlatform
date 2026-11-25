from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, relationship, Mapped
from typing import List, Optional, TYPE_CHECKING
from .base import Base

from .user import User

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
    