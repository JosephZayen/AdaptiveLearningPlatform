from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, relationship, Mapped
from typing import List, Optional, TYPE_CHECKING
from .base import Base

if TYPE_CHECKING:
    from .paper import Paper

class Textbook(Base):
    __tablename__ = "textbook"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    papers: Mapped[List["Paper"]] = relationship(
        back_populates="textbook"
    )
    chapters: Mapped[List["Chapter"]] = relationship(
        back_populates="textbook",
        cascade="all, delete-orphan"
    )
    name: Mapped[str]

class Chapter(Base):
    __tablename__ = "chapter"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    textbook_id: Mapped[int] = mapped_column(ForeignKey("textbook.id"))
    textbook: Mapped["Textbook"] = relationship(
        back_populates="chapters"
    )
    content: Mapped[str]
    order: Mapped[int]
    name: Mapped[str]