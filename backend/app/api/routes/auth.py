from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.models import User
from app.crud import get_user_by_username, create_user
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
)
from app.core.db import get_session
from app.models import LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=User)
def register(
    request: LoginRequest,
    session: Session = Depends(get_session),
):
    if get_user_by_username(session, request.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    hashed_password = get_password_hash(request.password)
    return create_user(session, request.username, hashed_password)

@router.post("/login")
def login(
    data: LoginRequest,  # Oczekuje danych w ciele żądania
    session: Session = Depends(get_session),
):
    user = get_user_by_username(session, data.username)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
