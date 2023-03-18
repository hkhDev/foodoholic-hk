import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./index.scss";

const Signup = () => {
  const navigate = useNavigate();
  const [icon, setIcon] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [iconModalShow, setIconModalShow] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [signUpStatus, setSignUpStatus] = useState(false);
  const [message, setMessage] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const handleIconModalClose = () => {
    setIconModalShow(false);
  };

  const iconArr = Array.from({ length: 8 }, (_, i) => i + 1);

  const handleMessageModalClose = () => {
    setMessageModalShow(false);
    signUpStatus && navigate("/signin");
  };

  const handleSubmit = async (event) => {
    // prevent page refresh
    event.preventDefault();
    // email validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage({ title: "Warning!", body: "Invalid email" });
      setMessageModalShow(true);
    } else {
      await axios
        .post("/signup", {
          name,
          email,
          password,
          icon,
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
      setMessageModalShow(true);
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
              {/* <Form.Control type="hidden" /> */}
              <Image
                src={
                  "images/" +
                  (icon === "" ? "avatar_unselected" : icon) +
                  ".png"
                }
                onClick={() => setIconModalShow(true)}
                className="signup-default-icon hand-cursor"
              />
              <p>Select your icon</p>
              <Modal show={iconModalShow} onHide={handleIconModalClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Select Icon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Container>
                    <Row>
                      {iconArr.map((icon, index) => {
                        const iconName = `icon${icon}`;
                        return (
                          <Col xs="3" className="">
                            <div
                              className="signup-select-icon"
                              tabIndex={index}
                              onClick={() => {
                                setIcon(iconName);
                                setIconModalShow(false);
                              }}
                            >
                              <Image
                                roundedCircle
                                fluid
                                src={`/images/${iconName}.png`}
                              />
                            </div>
                          </Col>
                        );
                      })}
                      <div className="align-center signup-icon-attribution">
                        <a
                          href="https://iconscout.com/icons/avatar"
                          target="_blank"
                          className="signup-icon-attribution-link"
                        >
                          Avatar Icon
                        </a>{" "}
                        by{" "}
                        <a
                          href="https://iconscout.com/contributors/dmitriy-bondarchuk"
                          target="_blank"
                          className="signup-icon-attribution-link"
                        >
                          Dmitriy Bondarchuk
                        </a>
                      </div>
                    </Row>
                  </Container>
                </Modal.Body>
                {/* <Modal.Footer>
                  <Button variant="primary">Select</Button>
                  <Button
                    variant="outline-danger"
                    onClick={handleIconModalClose}
                  >
                    Close
                  </Button>
                </Modal.Footer> */}
              </Modal>
            </Form.Group>
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
        <Modal show={messageModalShow} onHide={handleMessageModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{message.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message.body}</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleMessageModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
};

export default Signup;
