from sqlmodel import Session, select
from app.models import Book, Loan, LoanStatus, User
import datetime
from fastapi import HTTPException

def create_book(session: Session, book: Book) -> Book:
    session.add(book)
    session.commit()
    session.refresh(book)
    return book

def get_books(session: Session) -> list[Book]:
    statement = select(Book)
    return session.exec(statement).all()

def get_book(session: Session, book_id: int) -> Book:
    return session.get(Book, book_id)

def update_book(session: Session, book_id: int, updated_book: Book) -> Book:
    db_book = session.get(Book, book_id)
    if not db_book:
        return None
    for key, value in updated_book.dict(exclude_unset=True).items():
        setattr(db_book, key, value)
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def delete_book(session: Session, book_id: int) -> str:
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    if db_book.history_of_leases:
        db_book.is_permanently_unavailable = True
        db_book.is_available = False
        session.add(db_book)
        session.commit()
        return "permanently unavailable"
    else:
        session.delete(db_book)
        session.commit()
        return "deleted successfully"

def create_loan(session: Session, loan: Loan) -> Loan:
    session.add(loan)
    session.commit()
    session.refresh(loan)
    return loan

def get_loans(session: Session) -> list[Loan]:
    statement = select(Loan)
    return session.exec(statement).all()

def get_loans_by_user_id(session: Session, user_id: int) -> list[Loan]:
    statement = select(Loan).where(Loan.user_id == user_id)
    return session.exec(statement).all()

def get_loan(session: Session, loan_id: int) -> Loan:
    return session.get(Loan, loan_id)

def update_loan(session: Session, loan_id: int, updated_loan: Loan) -> Loan:
    db_loan = session.get(Loan, loan_id)
    if not db_loan:
        return None
    for key, value in updated_loan.dict(exclude_unset=True).items():
        setattr(db_loan, key, value)
    session.add(db_loan)
    session.commit()
    session.refresh(db_loan)
    return db_loan

def delete_loan(session: Session, loan_id: int) -> bool:
    db_loan = session.get(Loan, loan_id)
    if not db_loan:
        return False
    session.delete(db_loan)
    session.commit()
    return True

def change_loan_status(session: Session, loan_id: int, status: LoanStatus) -> Loan:
    db_loan = session.get(Loan, loan_id)
    if not db_loan:
        return None
    db_loan.status = status
    session.add(db_loan)
    session.commit()
    session.refresh(db_loan)
    return db_loan

def change_book_availability(session: Session, book_id: int, availability: bool) -> Book:
    db_book = session.get(Book, book_id)
    if not db_book:
        return None
    db_book.is_available = availability
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def add_loan_to_history(session: Session, book_id: int, loan_id: int) -> Book:
    db_book = session.get(Book, book_id)
    print(book_id)
    if not db_book:
        print("Book not found")
        return None
    db_book.history_of_leases = db_book.history_of_leases + [loan_id]
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def add_loan_to_user(session: Session, user_id: int, loan_id: int) -> User:
    db_user = session.get(User, user_id)
    if not db_user:
        return None
    db_user.user_loans = db_user.user_loans + [loan_id]
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def remove_loan_from_user(session: Session, user_id: int, loan_id: int) -> User:
    db_user = session.get(User, user_id)
    if not db_user:
        return None
    db_user.user_loans = [loan for loan in db_user.user_loans if loan != loan_id]
    session.commit()
    return db_user

def edit_loan_dates(session: Session, loan_id: int, loan_date: datetime.date, return_date: datetime.date) -> Loan:
    db_loan = session.get(Loan, loan_id)
    if not db_loan:
        return None
    db_loan.loan_date = loan_date
    db_loan.return_date = return_date
    session.add(db_loan)
    session.commit()
    session.refresh(db_loan)
    return db_loan

def get_user_by_username(session: Session, username: str) -> User:
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()

def create_user(session: Session, username: str, hashed_password: str) -> User:
    user = User(username=username, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def delete_user(session: Session, user_id: int) -> bool:
    user = session.get(User, user_id)
    if not user:
        return False
    active_loans = session.exec(
        select(Loan)
        .where(Loan.user_id == user_id)
        .where(Loan.status != LoanStatus.Returned)
    ).all()
    if active_loans:
        raise HTTPException(status_code=400, detail="Nie można usunąć użytkownika z aktywnymi wypożyczeniami")
    session.delete(user)
    session.commit()
    return True
