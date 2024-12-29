from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from datetime import datetime, timedelta, time
from app.models import Book, Loan, LoanStatus
from app.crud import create_loan, delete_loan, change_loan_status, change_book_availability, add_loan_to_history, edit_loan_dates
from app.core.db import get_session

router = APIRouter(prefix="/actions", tags=["actions"])

@router.put("/reserve/{book_id}/{user_id}", response_model=Loan)
def reserve_book(book_id: int, user_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book.is_available:
        raise HTTPException(status_code=400, detail="Book is not available")
    loan = create_loan(session, Loan(
        book_id = book_id,
        user_id = user_id,
        return_date = datetime.combine(datetime.today() + timedelta(days=1), time.max),
        status = LoanStatus.Reserved
    ))
    change_book_availability(session, book_id, False)
    return loan

@router.put("/loan_book/{loan_id}", response_model=Loan)
def loan_book(loan_id: int, session: Session = Depends(get_session)) -> Loan:
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.status != LoanStatus.Reserved:
        raise HTTPException(status_code=400, detail="Book is not reserved")
    change_loan_status(session, loan_id, LoanStatus.Loaned)
    add_loan_to_history(session, loan.book_id, loan_id)
    return_date = datetime.combine(datetime.today() + timedelta(days=14), time.max)
    edit_loan_dates(session, loan_id, datetime.today(), return_date)
    return loan

@router.put("/return/{loan_id}", response_model=Loan)
def return_book(loan_id: int, session: Session = Depends(get_session)) -> Loan:
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.status != LoanStatus.Loaned:
        raise HTTPException(status_code=400, detail="Book is not loaned")
    change_loan_status(session, loan_id, LoanStatus.Returned)
    change_book_availability(session, loan.book_id, True)
    edit_loan_dates(session, loan_id, loan.loan_date, datetime.today())
    return loan

@router.delete("/cancel_loan/{loan_id}")
def cancel_loan(loan_id: int, session: Session = Depends(get_session)):
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.status != LoanStatus.Reserved:
        raise HTTPException(status_code=400, detail="Only loans with status 'Reserved' can be canceled")
    delete_loan(session, loan_id)
    change_book_availability(session, loan.book_id, True)
    return {"message": "Loan cancelled successfully"}
