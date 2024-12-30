from fastapi import APIRouter
from app.api.routes import books
from app.api.routes import loans
from app.api.routes import actions
from app.api.routes import auth
from app.api.routes import users

api_router = APIRouter()
api_router.include_router(books.router)
api_router.include_router(loans.router)
api_router.include_router(actions.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)