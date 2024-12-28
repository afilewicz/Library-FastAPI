from sqlmodel import Session, select
from app.models import Book, Loan, LoanStatus, User

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

def delete_book(session: Session, book_id: int) -> bool:
    db_book = session.get(Book, book_id)
    if not db_book:
        return False
    session.delete(db_book)
    session.commit()
    return True

def create_loan(session: Session, loan: Loan) -> Loan:
    session.add(loan)
    session.commit()
    session.refresh(loan)
    return loan

def get_loans(session: Session) -> list[Loan]:
    statement = select(Loan)
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

def get_user_by_username(session: Session, username: str) -> User:
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()

def create_user(session: Session, username: str, hashed_password: str) -> User:
    user = User(username=username, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user