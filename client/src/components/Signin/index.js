import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import { LinkContainer } from "react-router-bootstrap";
import {
  Button,
  Card,
  Form,
  FloatingLabel,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./index.scss";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [message, setMessage] = useState({});

  const handleClose = () => setModalShow(false);

  const handleSubmit = async (event) => {
    // prevent page refresh
    event.preventDefault();
    // email validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // console.log("Invalid email");
      setMessage({ title: "Warning!", body: "Invalid email" });
      setModalShow(true);
    } else {
      await axios
        .post("/signin", {
          email,
          password,
          Headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log(res.data);
          navigate("/");
          setEmail("");
          setPassword("");
          localStorage.setItem("jwt", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch({ type: "USER", payload: res.data.user });
        })
        .catch((error) => {
          // console.log(error.response.data);
          setMessage({ title: "Warning!", body: error.response.data.error });
        });
      setModalShow(true);
    }
  };

  const renderSignin = () => {
    return (
      <Card className="card">
        <Card.Body>
          <Card.Title className="title">SIGN IN</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FloatingLabel>
            </Form.Group>

            <InputGroup className="mb-3">
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type={passwordHidden ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FloatingLabel>
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon={passwordHidden ? faEye : faEyeSlash}
                  onClick={() => setPasswordHidden(!passwordHidden)}
                />
              </InputGroup.Text>
            </InputGroup>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <br />
            <br />
            <Form.Group>
              <LinkContainer to="/Signup">
                <Form.Text id="passwordHelpBlock">
                  Don't have an account yet?
                </Form.Text>
              </LinkContainer>
            </Form.Group>
          </Form>
        </Card.Body>
        <Modal show={modalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{message.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message.body}</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  };

  useEffect(() => {
    state && navigate("/");
  });

  return renderSignin();
};

export default Signin;
