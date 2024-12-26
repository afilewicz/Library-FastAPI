from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, Integer
from typing import Optional, List
from enum import Enum
import datetime

class Book(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    author: str
    publisher: str
    date_of_publication: datetime.date
    price: float
    history_of_leases: Optional[List[int]] = Field(default=[], sa_column=Column(ARRAY(Integer)))
    is_available: bool = True

    loans: List["Loan"] = Relationship(back_populates="book")

class LoanStatus(str, Enum):
    Free = "Free"
    Reserved = "Reserved"
    Loaned = "Loaned"

class Loan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    user_id: int
    loan_date: Optional[datetime.date] = None
    return_date: Optional[datetime.date] = None
    status: LoanStatus

    book: "Book" = Relationship(back_populates="loans")
