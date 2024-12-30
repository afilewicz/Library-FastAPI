from fastapi import APIRouter, Depends, HTTPException, status
from app.core.db import get_session
from app.core.auth import get_current_user
from app.models import User
from app.crud import delete_user
from sqlmodel import Session

router = APIRouter(prefix="/users", tags=["users"])

@router.delete("/me", status_code=204)
def delete_own_account(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    try:
        delete_user(session, current_user.id)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)