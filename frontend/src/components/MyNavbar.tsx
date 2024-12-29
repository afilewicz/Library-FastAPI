"use client";

import React, {useEffect, useState} from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import LogoutButton from "@/components/LogoutButton";
import {usePathname} from "next/navigation";


function MyNavbar() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

      useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        setIsLoggedIn(!!token);
      }, [pathname]);

    if (isLoggedIn === null) {
        return null;
    }

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
            {isLoggedIn && <LogoutButton />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;