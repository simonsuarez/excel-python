
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base


class Usuario(Base):
    __tablename__ = 'usuarios'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str | None] = mapped_column(String(30), default=None)
    age: Mapped[int] = mapped_column(Integer)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)