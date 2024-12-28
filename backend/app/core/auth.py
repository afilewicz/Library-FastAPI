from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models import User
from app.crud import get_user_by_username
from app.core.config import settings
from sqlmodel import Session
from app.core.db import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = get_user_by_username(session, username)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def require_superuser(current_user: User = Depends(get_current_user)):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user