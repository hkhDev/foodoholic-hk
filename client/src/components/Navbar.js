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
        <LinkContainer to={state ? "/" : "/signin"}>
          <Navbar.Brand className="brand-logo">Foodoholic</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {renderList()}
            {/* <NavDropdown title="Profile" id="basic-nav-dropdown">
              <LinkContainer to="/Profile">
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
