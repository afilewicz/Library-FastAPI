"use client";
import React, { useEffect, useState } from 'react';
import BooksView from '@/components/BooksList';
import { useRouter } from "next/navigation";
import { Container, Spinner } from "react-bootstrap";

export default function BooksPage() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsInitialized(true);
    }
  }, [router]);

  if (!isInitialized) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div>
      <BooksView />
    </div>
  );
}
