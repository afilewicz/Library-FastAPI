import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { isUserAdmin } from "@/utils/authUtils";
import EditBookModal from "@/components/EditBookModal";
import { Book } from "@/types";
import AddBookModal from "@/components/AddBookModal";
import {useRouter} from "next/navigation";

function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get("http://localhost:8000/api/v1/books/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
        console.log(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks().catch(console.error);
  }, []);

  const reserveBook = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const base64Url = token!.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      const userId = payload.user_id;

      const response = await axios.put(
        `http://localhost:8000/api/v1/actions/reserve/${id}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const updatedBooks = books.map((book) => {
          if (book.id === id) {
            return { ...book, is_available: false };
          }
          return book;
        });
        setBooks(updatedBooks);
      } else {
        setError("Failed to reserve book");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reserve book");
    }
  };

  const handleDelete = async (bookId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.delete(`http://localhost:8000/api/v1/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { message } = response.data;

      if (message === "permanently unavailable") {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId ? { ...book, is_available: false, is_permanently_unavailable: true } : book
          )
        );
        alert("Książka została oznaczona jako trwale niedostępna");
      } else if (message === "deleted successfully") {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        alert("Książka została usunięta");
      }
    } catch (err: any) {
      alert("Nie udało się usunąć książki");
    }
  };

  const handleAddBook = async (newBook: Book) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.post(
        "http://localhost:8000/api/v1/books/",
        {
          ...newBook,
          date_of_publication: new Date(newBook.date_of_publication).toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setBooks([...books, response.data]);
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Nie udało się dodać książki");
    }
  };

  const handleEditSave = async (updatedBook: Book) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `http://localhost:8000/api/v1/books/${updatedBook.id}`,
        updatedBook,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === updatedBook.id ? { ...updatedBook } : book
        )
      );
      setShowEditModal(false);
      setSelectedBook(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Nie udało się zaktualizować książki");
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć swoje konto?")) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Użytkownik nie jest zalogowany");
          return;
        }
        await axios.delete("http://localhost:8000/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("access_token");
        router.push("/login");
      } catch (error: any) {
        setError(error.response?.data?.detail || "Nie udało się usunąć konta.");
      }
    }
  };

  const filteredBooks = books.filter(
    (book) => {
      const matchesSearchTerm =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase());

      if (isUserAdmin()) {
        return (
            matchesSearchTerm
            );
      } else {
        return (
        !book.is_permanently_unavailable && matchesSearchTerm);
      }
    }
  );


  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const adminControls = (book: Book) => (
    <>
      <Button
        className="btn btn-warning me-2"
        onClick={() => {
          setSelectedBook(book);
          setShowEditModal(true);
        }}
      >
        Edytuj
      </Button>
      <Button className="btn btn-danger" onClick={() => handleDelete(book.id)}>
        Usuń
      </Button>
    </>
  );

  const userControls = (book: Book) => (
    book.is_available ? (
      <Button className="btn btn-primary" onClick={() => reserveBook(book.id)}>
        Zarezerwuj
      </Button>
    ) : (
      <Button className="btn btn-secondary" disabled>
        Zarezerwuj
      </Button>)
  );

  return (
      <Container className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h1>Książki</h1>
          {isUserAdmin() && <Button variant="success" onClick={() => setShowAddModal(true)}>
            Dodaj książkę
          </Button>}
          {!isUserAdmin() && <Button variant="danger" onClick={handleDeleteUser}>
            Usuń konto
          </Button>}
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <input
              type="text"
              placeholder="Wyszukaj książki..."
              className="form-control w-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Tytuł</th>
              <th>Autor</th>
              <th>Wydawca</th>
              <th>Data wydania</th>
              <th>Cena</th>
              <th>Dostępna</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{new Date(book.date_of_publication).toLocaleDateString()}</td>
                  <td>{book.price.toFixed(2)} zł</td>
                  {isUserAdmin() && (
                  <td>
                    {book.is_permanently_unavailable ? "Niedostępna" : "Dostępna"}
                  </td>
                  )}
                  <td className="text-center">
                    {isUserAdmin() && !book.is_permanently_unavailable && adminControls(book)}
                    {!isUserAdmin() && userControls(book)}
                  </td>
                </tr>
            ))}
            </tbody>
          </Table>
          <EditBookModal
              show={showEditModal}
              book={selectedBook}
              onHide={() => setShowEditModal(false)}
              onSave={handleEditSave}
          />
          <AddBookModal
              show={showAddModal}
              onCloseAction={() => setShowAddModal(false)}
              onAddAction={handleAddBook}
          />
      </Container>
);
}

export default BooksList;
