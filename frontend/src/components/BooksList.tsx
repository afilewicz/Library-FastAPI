"use client";
import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";

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
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/v1/books/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch books");
        setLoading(false);
      }
    };

    fetchBooks();
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
        throw new Error("Failed to reserve book");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reserve book");
    }
  };

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
            <th />
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
                {book.is_available ? (
                  <Button className="btn btn-primary" onClick={() => reserveBook(book.id)}>
                    Zarezerwuj
                  </Button>
                ) : (
                  <Button className="btn btn-secondary" disabled>
                    Zarezerwuj
                  </Button>
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
