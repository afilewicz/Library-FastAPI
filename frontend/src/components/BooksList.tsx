"use client"
import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button} from "react-bootstrap";

interface Book {
  id: number;
  publisher: string;
  price: number;
  is_available: boolean;
  title: string;
  author: string;
  date_of_publication: string;
}

function BooksView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/books/");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  const reserveBook = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/actions/reserve/${id}/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to reserve book");
      }
      const updatedBooks = books.map((book) => {
        if (book.id === id) {
          return { ...book, is_available: false };
        }
        return book;
      });
      setBooks(updatedBooks);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Container className="mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Autor</th>
            <th>Wydawca</th>
            <th>Data wydania</th>
            <th>Cena</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{new Date(book.date_of_publication).toLocaleDateString()}</td>
              <td>{book.price.toFixed(2)} zł</td>
              <td className="text-center">
                {book.is_available? (
                    <Button className="btn btn-primary" onClick={() => reserveBook(book.id)}>Zarezerwuj</Button>
                ) : (
                    <Button className="btn btn-secondary" disabled>Zarezerwuj</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default BooksView;
