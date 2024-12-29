"use client";
import React, { useEffect, useState } from "react";
import {Container, Table, Spinner, Alert, Button} from "react-bootstrap";
import axios from "axios";
import { Loan } from "@/types";
import { isUserAdmin } from "@/utils/authUtils";


export default function LoansView() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const endpoint = isUserAdmin()
            ? "http://localhost:8000/api/v1/loans"
            : "http://localhost:8000/api/v1/loans/my-loans";
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoans(response.data);
      } catch (err) {
        setError("Nie udało się załadować listy wypożyczeń");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans().catch(console.error);
  }, []);

  const handleLoanBook = async (loanId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/v1/actions/loan_book/${loanId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoans((prevLoans) =>
      prevLoans.map((loan) =>
         loan.id === loanId
      ? { ...loan, status: response.data.status, loan_date: response.data.loan_date, return_date: response.data.return_date }
      : loan
      )
      );
    } catch (err) {
      setError("Nie udało się wypożyczyć książki");
    }
  };

  const handleReturnBook = async (loanId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/v1/actions/return/${loanId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === loanId
      ? { ...loan, status: response.data.status, loan_date: response.data.loan_date, return_date: response.data.return_date }
      : loan
      )
      );
    } catch (err) {
      setError("Nie udało się zwrócić książki");
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
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
      <Container className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{isUserAdmin() ? "Wypożyczenia użytkowników" : "Moje Wypożyczenia"}</h1>
        </div>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Tytuł Książki</th>
            <th>Autor</th>
            {isUserAdmin() && <th>Użytkownik</th>}
            <th>Data Wypożyczenia</th>
            <th>Data Zwrotu</th>
            <th>Status</th>
            {isUserAdmin() && <th> Akcje </th>}
          </tr>
          </thead>
          <tbody>
          {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.book_title}</td>
                <td>{loan.book_author}</td>
                {isUserAdmin() && <td>{loan.user_username}</td>}
                {loan.loan_date ? (
                    <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                ) : (
                    <td />
                )}
                <td>{loan.return_date ? new Date(loan.return_date).toLocaleDateString() : "N/A"}</td>
                <td>{loan.status}</td>
                {isUserAdmin() && (
                  <td className="text-center">
                    {loan.status === "Reserved" && (
                        <Button
                            className="btn btn-primary me-2"
                            onClick={() => handleLoanBook(loan.id)}
                        >
                          Wypożycz
                        </Button>
                    )}
                    {loan.status === "Loaned" && (
                        <Button
                            className="btn btn-warning"
                            onClick={() => handleReturnBook(loan.id)}
                        >
                          Zwrot
                        </Button>
                    )}
                  </td>
                    )}
                  </tr>
                  ))}
          </tbody>
        </Table>
      </Container>
);
}
