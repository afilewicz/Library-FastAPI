"use client";
import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { Book } from "@/types";

interface AddBookModalProps {
  show: boolean;
  onCloseAction: () => void;
  onAddAction: (book: Book) => void;
}

export default function AddBookModal({ show, onCloseAction, onAddAction }: AddBookModalProps) {
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    publisher: "",
    date_of_publication: "",
    price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newBook.title || newBook.title.trim() === "") {
      newErrors.title = "Tytuł jest wymagany.";
    }
    if (!newBook.author || newBook.author.trim() === "") {
      newErrors.author = "Autor jest wymagany.";
    }
    if (!newBook.publisher || newBook.publisher.trim() === "") {
      newErrors.publisher = "Wydawca jest wymagany.";
    }
    if (!newBook.date_of_publication) {
      newErrors.date_of_publication = "Data wydania jest wymagana.";
    }
    if (!newBook.price || newBook.price <= 0) {
      newErrors.price = "Cena musi być większa od zera.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setGlobalError(null); // Reset global error
    if (validateFields()) {
      try {
        onAddAction(newBook as Book);
        setNewBook({
          title: "",
          author: "",
          publisher: "",
          date_of_publication: "",
          price: 0,
        });
        onCloseAction();
      } catch (err: any) {
        setGlobalError("Wystąpił błąd podczas dodawania książki.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onCloseAction}>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj książkę</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {globalError && <Alert variant="danger">{globalError}</Alert>}
        <Form noValidate>
          <Form.Group className="mb-3" controlId="bookTitle">
            <Form.Label>Tytuł</Form.Label>
            <Form.Control
              type="text"
              value={newBook.title}
              isInvalid={!!errors.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="bookAuthor">
            <Form.Label>Autor</Form.Label>
            <Form.Control
              type="text"
              value={newBook.author}
              isInvalid={!!errors.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="bookPublisher">
            <Form.Label>Wydawca</Form.Label>
            <Form.Control
              type="text"
              value={newBook.publisher}
              isInvalid={!!errors.publisher}
              onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">{errors.publisher}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="bookDate">
            <Form.Label>Data Wydania</Form.Label>
            <Form.Control
              type="date"
              value={newBook.date_of_publication}
              isInvalid={!!errors.date_of_publication}
              onChange={(e) =>
                setNewBook({ ...newBook, date_of_publication: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.date_of_publication}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="bookPrice">
            <Form.Label>Cena</Form.Label>
            <Form.Control
              type="number"
              value={newBook.price}
              isInvalid={!!errors.price}
              onChange={(e) =>
                setNewBook({ ...newBook, price: parseFloat(e.target.value) })
              }
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseAction}>
          Anuluj
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Dodaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
