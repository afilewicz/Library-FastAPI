from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.models import Loan
from app.crud import create_loan, get_loans, get_loan, update_loan, delete_loan
from app.core.db import get_session

router = APIRouter(prefix="/loans", tags=["loans"])

@router.post("/", response_model=Loan)
def create_loan_endpoint(loan: Loan, session: Session = Depends(get_session)):
    return create_loan(session, loan)

@router.get("/", response_model=list[Loan])
def list_loans(session: Session = Depends(get_session)):
    return get_loans(session)

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