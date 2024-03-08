import React from "react";
import { NavLink } from "react-router-dom";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import "./NavBar.css";

const NavBar = () => {
  return (
    <Navbar className="navbar-custom" variant="dark">
      <Container fluid>
        <Nav className="ms-auto">
          <Nav.Link className="px-3" as={NavLink} to={"/search"}>
            Search
          </Nav.Link>
          <Nav.Link className="px-3" as={NavLink} to={"/favorites"}>
            Favorites
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
