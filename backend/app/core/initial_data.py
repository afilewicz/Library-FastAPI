from sqlmodel import Session
from app.models import Book
from app.models import Loan
from datetime import date

def load_initial_data(session: Session):
    # Sprawdź, czy w bazie istnieją już książki
    existing_books = session.query(Book).first()
    if existing_books:
        print("Dane początkowe są już załadowane.")
        return

    print("Ładowanie danych początkowych...")

    # Dodaj przykładowe książki
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
    session.commit()

    print("Dane początkowe zostały załadowane.")
