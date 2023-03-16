import React, { useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../App";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <LinkContainer key={1} to="/Search">
          <Nav.Link>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Nav.Link>
        </LinkContainer>,
        <LinkContainer key={2} to="/Profile">
          <Nav.Link>Profile</Nav.Link>
        </LinkContainer>,
        <LinkContainer key={3} to="/Createpost">
          <Nav.Link>Create Post</Nav.Link>
        </LinkContainer>,

        <LinkContainer key={4} to="/signin">
          <Nav.Link
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
            }}
          >
            Logout
          </Nav.Link>
        </LinkContainer>,
      ];
    } else {
      return [
        <LinkContainer key={1} to="/Signup">
          <Nav.Link>Sign Up</Nav.Link>
        </LinkContainer>,
        <LinkContainer key={2} to="/Signin">
          <Nav.Link>Sign In</Nav.Link>
        </LinkContainer>,
      ];
    }
  };
  return (
    <Navbar collapseOnSelect bg="light" expand="lg">
      <Container>
        <Nav className="me-auto">
          <LinkContainer to={state ? "/" : "/signin"}>
            <Nav.Link className="brand-logo">Foodoholic</Nav.Link>
          </LinkContainer>
        </Nav>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">{renderList()}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
