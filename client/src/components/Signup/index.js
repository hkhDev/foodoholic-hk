import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Card, Form, FloatingLabel, Modal } from "react-bootstrap";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({});
  // const [messageType, setMessageType] = useState("");

  const handleClose = () => setShow(false);

  const handleSubmit = async (event) => {
    // prevent page refresh
    event.preventDefault();
    console.log(`The value for the name: ${name}`);
    console.log(`The value for the email: ${email}`);
    console.log(`The value for the password: ${password}`);
    // email validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage({ title: "Warning!", body: "Invalid email" });
      setShow(true);
    } else {
      // const newUserData = {
      //   name,
      //   email,
      //   password,
      // };

      // await fetch("http://localhost:5000/signup", {
      //   method: "post",
      //   header: {
      //     "Content-type": "application/json",
      //   },
      //   body: JSON.stringify(newUserData),
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((err) => ({ err }));
      await axios
        .post("http://localhost:5000/signup", {
          name,
          email,
          password,
          Headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setMessage({ title: "Success!", body: res.data.message });
          setEmail("");
          setName("");
          setPassword("");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage({ title: "Warning!", body: error.response.data.error });
        });
      console.log("form submitted ✅");
      setShow(true);
    }
  };

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

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FloatingLabel>
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
            <br />
            <br />
            <Form.Group>
              <LinkContainer to="/Login">
                <Form.Text id="passwordHelpBlock">
                  Already have an account?
                </Form.Text>
              </LinkContainer>
            </Form.Group>
          </Form>
        </Card.Body>
        <Modal show={show} onHide={handleClose}>
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
