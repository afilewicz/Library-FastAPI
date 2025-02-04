from sqlmodel import Session
from app.models import Book
from app.models import Loan
from app.models import User
from datetime import date
from app.core.config import settings

from app.core.security import get_password_hash


def load_initial_data(session: Session):
    existing_books = session.query(Book).first()
    if existing_books:
        print("Dane początkowe są już załadowane.")
        return

    print("Ładowanie danych początkowych...")

    books = [
        Book(title="Pan Tadeusz", author="Adam Mickiewicz", publisher="Ossolineum",
             date_of_publication=date(1834, 6, 28), price=59.99),
        Book(title="Lalka", author="Bolesław Prus", publisher="Czytelnik", date_of_publication=date(1890, 1, 1),
             price=49.99),
        Book(title="Quo Vadis", author="Henryk Sienkiewicz", publisher="Gebethner i Wolff",
             date_of_publication=date(1896, 3, 26), price=39.99),
        Book(title="Ferdydurke", author="Witold Gombrowicz", publisher="Literackie",
             date_of_publication=date(1937, 8, 15), price=44.99),
    ]
    session.add_all(books)

    # Dodaj użytkownika
    existing_user = session.query(User).first()
    print("existing_user: ", existing_user)
    if not existing_user:
        hashed_password = get_password_hash(settings.SUPERUSER_PASSWORD)
        user = User(
            username="admin",
            hashed_password=hashed_password,
            is_superuser=True,
        )
        session.add(user)
        print("Użytkownik został załadowany.")

    session.commit()
    print("Dane początkowe zostały załadowane.")
