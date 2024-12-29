"use client";

import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import LogoutButton from "@/components/LogoutButton";
import {usePathname} from "next/navigation";


function MyNavbar() {

    const pathname = usePathname(); // Pobierz aktualną ścieżkę

    return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Biblioteka</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/books">Książki</Nav.Link>
                <Nav.Link href="/loans">Wypożyczenia</Nav.Link>
            </Nav>
            {pathname !== "/login" && pathname !== "/register"  && <LogoutButton />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;