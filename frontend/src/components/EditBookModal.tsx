import React from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { Book } from "@/types";

interface EditBookModalProps {
  show: boolean;
  book: Book | null;
  onHide: () => void;
  onSave: (updatedBook: Book) => void;
}

export default function EditBookModal({
  show,
  book,
  onHide,
  onSave,
}: EditBookModalProps) {
  const [updatedBook, setUpdatedBook] = React.useState<Book | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [globalError, setGlobalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (book) {
      setUpdatedBook({ ...book });
    }
  }, [book]);

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!updatedBook?.title || updatedBook.title.trim() === "") {
      newErrors.title = "Tytuł jest wymagany.";
    }
    if (!updatedBook?.author || updatedBook.author.trim() === "") {
      newErrors.author = "Autor jest wymagany.";
    }
    if (!updatedBook?.publisher || updatedBook.publisher.trim() === "") {
      newErrors.publisher = "Wydawca jest wymagany.";
    }
    if (!updatedBook?.price || updatedBook.price <= 0) {
      newErrors.price = "Cena musi być większa od zera.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    setGlobalError(null); // Reset global error
    if (validateFields() && updatedBook) {
      try {
        onSave(updatedBook);
        onHide();
      } catch (err: any) {
        setGlobalError("Wystąpił błąd podczas zapisywania zmian.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edytuj książkę</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {globalError && <Alert variant="danger">{globalError}</Alert>}
        {updatedBook && (
          <Form noValidate>
            <Form.Group className="mb-3" controlId="bookTitle">
              <Form.Label>Tytuł</Form.Label>
              <Form.Control
                type="text"
                value={updatedBook.title}
                isInvalid={!!errors.title}
                onChange={(e) =>
                  setUpdatedBook({ ...updatedBook, title: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookAuthor">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                value={updatedBook.author}
                isInvalid={!!errors.author}
                onChange={(e) =>
                  setUpdatedBook({ ...updatedBook, author: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.author}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookPublisher">
              <Form.Label>Wydawca</Form.Label>
              <Form.Control
                type="text"
                value={updatedBook.publisher}
                isInvalid={!!errors.publisher}
                onChange={(e) =>
                  setUpdatedBook({ ...updatedBook, publisher: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.publisher}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookPrice">
              <Form.Label>Cena</Form.Label>
              <Form.Control
                type="number"
                value={updatedBook.price}
                isInvalid={!!errors.price}
                onChange={(e) =>
                  setUpdatedBook({
                    ...updatedBook,
                    price: parseFloat(e.target.value),
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Anuluj
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Zapisz
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
