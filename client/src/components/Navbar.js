import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Nav, Navbar } from "react-bootstrap";
import { UserContext } from "../App";

const NavBar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <LinkContainer key={1} to="/Profile">
          <Nav.Link>Profile</Nav.Link>
        </LinkContainer>,
        <LinkContainer key={2} to="/Createpost">
          <Nav.Link>Create Post</Nav.Link>
        </LinkContainer>,
        <LinkContainer key={3} to="/signin">
          <Nav.Link
            key={3}
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
          <Nav.Link>Signup</Nav.Link>
        </LinkContainer>,
        <LinkContainer key={2} to="/Signin">
          <Nav.Link>Login</Nav.Link>
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
