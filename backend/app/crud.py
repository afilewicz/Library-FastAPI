from sqlmodel import Session, select
from app.models import Book

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
