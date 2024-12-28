"use client";
import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useRouter} from "next/navigation";

interface Loan {
    id: number;
    book_title: string;
    book_author: string;
    user_username: string;
    loan_date: string;
    return_date: string | null;
    status: string;
}

export default function LoansView() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }
        const response = await axios.get("http://localhost:8000/api/v1/loans/my-loans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoans(response.data);
        setLoading(false);
      } catch (err) {
        setError("Nie udało się załadować listy wypożyczeń");
        setLoading(false);
      }
    };

    fetchLoans();
  }, [router]);

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

  return (
    <Container className="mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tytuł Książki</th>
            <th>Autor</th>
            <th>Data Wypożyczenia</th>
            <th>Data Zwrotu</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.book_title}</td>
              <td>{loan.book_author}</td>
              {loan.loan_date ? (
                <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
              ) : (
                <td></td>
              )}
              <td>{loan.return_date ? new Date(loan.return_date).toLocaleDateString() : "N/A"}</td>
              <td>{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
