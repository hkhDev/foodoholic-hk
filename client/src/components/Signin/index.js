import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Card, Form, FloatingLabel, Modal } from "react-bootstrap";
import "./index.scss";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({});

  const handleClose = () => setShow(false);

  const handleSubmit = async (event) => {
    // prevent page refresh
    event.preventDefault();
    console.log(`The value for the email: ${email}`);
    console.log(`The value for the password: ${password}`);
    // email validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      console.log("Invalid email");
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
        .post("http://localhost:5000/signin", {
          email,
          password,
          Headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          navigate("/");
          setEmail("");
          setPassword("");
          localStorage.setItem("jwt", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch({ type: "USER", payload: res.data.user });
          // setTimeout(() => {
          //   navigate("/login");
          // }, 1500);
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
  );
};

export default Signin;
