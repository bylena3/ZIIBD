import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">KrytykUŚ</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
              <Nav.Link as={Link} to="/movies">Filmy</Nav.Link>
              <Nav.Link as={Link} to="/series">Seriale</Nav.Link>
            </Nav>
            {/*<Form className="d-flex">*/}
            {/*  <Form.Control*/}
            {/*      type="search"*/}
            {/*      placeholder="Szukaj"*/}
            {/*      className="me-2"*/}
            {/*      aria-label="Search"*/}
            {/*  />*/}
            {/*  <Button variant="outline-success">Szukaj</Button>*/}
            {/*</Form>*/}
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default Navigation;