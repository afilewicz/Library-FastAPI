from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.models import Book
from app.crud import create_book, get_books, get_book, update_book, delete_book
from app.core.db import get_session

router = APIRouter(prefix="/books", tags=["books"])

@router.post("/", response_model=Book)
def create_book_endpoint(book: Book, session: Session = Depends(get_session)):
    return create_book(session, book)

@router.get("/", response_model=list[Book])
def list_books(session: Session = Depends(get_session)):
    return get_books(session)

@router.get("/{book_id}", response_model=Book)
def read_book(book_id: int, session: Session = Depends(get_session)):
    book = get_book(session, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=Book)
def update_book_endpoint(book_id: int, updated_book: Book, session: Session = Depends(get_session)):
    book = update_book(session, book_id, updated_book)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.delete("/{book_id}")
def delete_book_endpoint(book_id: int, session: Session = Depends(get_session)):
    success = delete_book(session, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book deleted successfully"}