"use client";

import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Link from "next/link";

function RegisterView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/register",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Zarejestrowano użytkownika:", response.data);
    setSuccess("Rejestracja zakończona sukcesem! Przekierowanie do logowania...");
    setError(null);
    setTimeout(() => {
      router.push("/login");
    }, 3000); // Przekierowanie po 3 sekundach
  } catch (err: any) {
    if (Array.isArray(err.response?.data?.detail)) {
      // Obsługa tablicy błędów
      const errorMessages = err.response.data.detail
        .map((error: any) => error.msg)
        .join(", ");
      setError(errorMessages);
    } else {
      // Obsługa pojedynczego błędu
      setError(err.response?.data?.detail || "Nie udało się zarejestrować użytkownika");
    }
    setSuccess(null);
  }
};


  return (
    <Container className="mt-5 mx-auto w-50">
      <h1>Zarejestruj się</h1>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Nazwa użytkownika</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Zarejestruj się
        </Button>
      </Form>
      <div className="mt-3">
        <span>Masz już konto? </span>
        <Link href="/login" className="btn btn-link"> Zaloguj się </Link>
      </div>
    </Container>
  );
}

export default RegisterView;
