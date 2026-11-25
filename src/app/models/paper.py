from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, relationship, Mapped
from typing import List, Optional, TYPE_CHECKING
from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .textbook import Textbook


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
    textbook_id: Mapped[Optional[int]] = mapped_column(ForeignKey("textbook.id"))
    textbook: Mapped["Textbook"] = relationship(
        back_populates="papers"
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
