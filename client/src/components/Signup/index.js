import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [signUpStatus, setSignUpStatus] = useState(false);
  const [message, setMessage] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClose = () => {
    setModalShow(false);
    signUpStatus && navigate("/signin");
  };

  const handleSubmit = async (event) => {
    // prevent page refresh
    event.preventDefault();
    // email validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage({ title: "Warning!", body: "Invalid email" });
      setModalShow(true);
    } else {
      await axios
        .post("/signup", {
          name,
          email,
          password,
          Headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setMessage({ title: "Success!", body: res.data.message });
          setEmail("");
          setName("");
          setPassword("");
          setSignUpStatus(true);
        })
        .catch((error) => {
          // console.log(error.response.data);
          setMessage({ title: "Warning!", body: error.response.data.error });
        });
      setModalShow(true);
    }
  };

  useEffect(() => {
    user && navigate("/");
  });

  return (
    <>
      <Card className="card">
        <Card.Body>
          <Card.Title className="title">SIGN UP</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <FloatingLabel
                controlId="floatingEmail"
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
            <Form.Group className="mb-3" controlId="formBasicName">
              <FloatingLabel
                controlId="floatingName"
                label="Name"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
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
              <InputGroup.Text className="hand-cursor">
                <FontAwesomeIcon
                  icon={passwordHidden ? faEye : faEyeSlash}
                  onClick={() => setPasswordHidden(!passwordHidden)}
                />
              </InputGroup.Text>
            </InputGroup>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
            <br />
            <br />
            <Form.Group>
              <LinkContainer to="/Signin">
                <Form.Text id="passwordHelpBlock" className="hand-cursor">
                  Already have an account?
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
    </>
  );
};

export default Signup;
