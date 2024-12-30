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

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    hashed_password: str
    is_superuser: bool = False
    user_loans: Optional[List[int]] = Field(default=[], sa_column=Column(ARRAY(Integer)))

    loans: List["Loan"] = Relationship(back_populates="user", cascade_delete=True)

class LoginRequest(SQLModel):
    username: str
    password: str

class LoanStatus(str, Enum):
    Returned = "Returned"
    Reserved = "Reserved"
    Loaned = "Loaned"

class Loan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    user_id: int = Field(foreign_key="user.id")
    loan_date: Optional[datetime.date] = None
    return_date: Optional[datetime.date] = None
    status: LoanStatus = "Reserved"

    book: "Book" = Relationship(back_populates="loans")
    user: "User" = Relationship(back_populates="loans")

class LoanResponse(SQLModel):
    id: int
    book_title: str
    book_author: str
    user_username: str
    loan_date: Optional[datetime.date]
    return_date: Optional[datetime.date]
    status: LoanStatus
