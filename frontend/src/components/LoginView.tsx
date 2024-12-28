"use client";

import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Container } from "react-bootstrap";
import {useRouter} from "next/navigation";
import Link from "next/link";

function LoginView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
      username,
      password,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);
    console.log("Zapisany token:", localStorage.getItem("access_token")); // Debug
    router.push("/books");
  } catch (err) {
    setError("Nieprawidłowy login lub hasło");
  }
};


  return (
      <Container className="mt-5 mx-auto w-50">
        <h1>Zaloguj się</h1>
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
            Zaloguj się
          </Button>

        </Form>
        <div className="mt-3">
          <span>Nie masz jeszcze konta? </span>
          <Link href="/register" className="btn btn-link">Zarejestruj się </Link>
        </div>
      </Container>
  );
}

export default LoginView;
