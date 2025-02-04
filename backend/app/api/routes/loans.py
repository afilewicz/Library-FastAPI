from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Loan, Book, LoanResponse
from app.crud import create_loan, get_loans, get_loan, update_loan, delete_loan, get_loans_by_user_id
from app.core.db import get_session
from app.core.auth import get_current_user, User

router = APIRouter(prefix="/loans", tags=["loans"])

@router.post("/", response_model=Loan)
def create_loan_endpoint(loan: Loan, session: Session = Depends(get_session)):
    return create_loan(session, loan)

@router.get("/", response_model=list[LoanResponse])
def list_all_loans(session: Session = Depends(get_session)):
    loans = session.exec(select(Loan)).all()

    book_ids = [loan.book_id for loan in loans]
    books = session.exec(select(Book).where(Book.id.in_(book_ids))).all()
    book_map = {book.id: (book.title, book.author) for book in books}

    user_ids = [loan.user_id for loan in loans]
    users = session.exec(select(User).where(User.id.in_(user_ids))).all()
    user_map = {user.id: user.username for user in users}

    enriched_loans = [
        LoanResponse(
            id=loan.id,
            book_title=book_map.get(loan.book_id, ("Unknown", "Unknown"))[0],
            book_author=book_map.get(loan.book_id, ("Unknown", "Unknown"))[1],
            user_username=user_map.get(loan.user_id, "Unknown"),
            loan_date=loan.loan_date,
            return_date=loan.return_date,
            status=loan.status,
        )
        for loan in loans
    ]

    return enriched_loans

@router.get("/my-loans", response_model=list[LoanResponse])
def get_my_loans(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):

    statement = select(Loan).where(Loan.user_id == current_user.id)
    loans = session.exec(statement).all()

    book_ids = [loan.book_id for loan in loans]
    books = session.exec(select(Book).where(Book.id.in_(book_ids))).all()
    book_map = {book.id: (book.title, book.author) for book in books}

    user_map = {current_user.id: current_user.username}

    enriched_loans = [
        LoanResponse(
            id=loan.id,
            book_title=book_map.get(loan.book_id, ("Unknown", "Unknown"))[0],
            book_author=book_map.get(loan.book_id, ("Unknown", "Unknown"))[1],
            user_username=user_map.get(loan.user_id, "Unknown"),
            loan_date=loan.loan_date,
            return_date=loan.return_date,
            status=loan.status,
        )
        for loan in loans
    ]

    return enriched_loans

@router.get("/{loan_id}", response_model=Loan)
def read_loan(loan_id: int, session: Session = Depends(get_session)):
    loan = get_loan(session, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.put("/{loan_id}", response_model=Loan)
def update_loan_endpoint(loan_id: int, updated_loan: Loan, session: Session = Depends(get_session)):
    loan = update_loan(session, loan_id, updated_loan)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.delete("/{loan_id}")
def delete_loan_endpoint(loan_id: int, session: Session = Depends(get_session)):
    success = delete_loan(session, loan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"message": "Loan deleted successfully"}