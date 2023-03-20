import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import Post from "../Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { loadingEffect } from "../Home";
import SelectIconModal from "../Signup/SelectIconModal";
import "./index.scss";

const Profile = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const [myposts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editProfileModalShow, setEditProfileModalShow] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileIcon, setEditProfileIcon] = useState("");
  const [iconModalShow, setIconModalShow] = useState(false);

  useEffect(() => {
    getMyPost();
  }, []);
  // console.log(state);

  const handleEditProfileModalShow = () => {
    setEditProfileName(state.name);
    setEditProfileIcon(state.icon);
    setEditProfileModalShow(true);
  };

  const handleEditProfileModalClose = () => {
    setEditProfileModalShow(false);
  };

  const handleIconModalClose = () => {
    setIconModalShow(false);
  };

  const handleProfileUpdate = (e) => {
    // setEditProfileModalShow(false);
    e.preventDefault();
    // console.log("Name updating");
    axios
      .put(
        "/editprofilename",
        {
          name: editProfileName,
          icon: editProfileIcon,
          _id: state._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // setPost(res.data);
        // setIsLoading(false);
        // console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch({ type: "USER", payload: res.data.user });
        setEditProfileModalShow();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const getMyPost = () => {
    axios
      .get("/myposts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("Get post");
        // console.log(res.data.myposts);
        setMyPosts(res.data.myposts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderPost = () => {
    if (myposts.length > 0) {
      // console.log(myposts);
      return (
        <Row>
          {myposts.map((post, index) => (
            <Col key={index} xl="4" lg="6">
              <Post post={post} />
            </Col>
          ))}
        </Row>
      );
    } else {
      return (
        <div className="align-center">
          <h2 className="profile-title">Create your first post</h2>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/createpost")}
          >
            Create
          </Button>
        </div>
      );
    }
  };

  return (
    <Container className="profile-body">
      {isLoading ? (
        loadingEffect()
      ) : (
        <>
          <Row className="profile-info">
            <Col xs="6" className="profile-info-left align-center">
              <Image
                roundedCircle
                fluid
                src={`images/${state.icon}.png`}
                className="profile-img"
              />
            </Col>
            <Col xs="6" className="profile-info-right ">
              <h1>
                {state && state.name}{" "}
                <FontAwesomeIcon
                  icon={faPen}
                  onClick={handleEditProfileModalShow}
                  className="profile-edit-icon hand-cursor"
                />
              </h1>
              <p>
                <strong>{myposts.length}</strong> posts
              </p>
            </Col>
          </Row>
          <hr />
          {renderPost()}

          <Modal
            show={editProfileModalShow}
            onHide={handleEditProfileModalClose}
          >
            <Form onSubmit={handleProfileUpdate}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="align-center">
                  <Image
                    roundedCircle
                    fluid
                    src={`images/${editProfileIcon}.png`}
                    onClick={() => setIconModalShow(true)}
                  />
                </div>
                <SelectIconModal
                  iconModalShow={iconModalShow}
                  handleIconModalClose={handleIconModalClose}
                  icon={editProfileIcon}
                  setIcon={setEditProfileIcon}
                />

                <InputGroup className="mt-3 mb-3">
                  <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                  <Form.Control
                    tyoe="input"
                    value={editProfileName}
                    onChange={(e) => {
                      setEditProfileName(e.target.value);
                    }}
                  />
                </InputGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-primary"
                  id="button-addon2"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleEditProfileModalClose}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Profile;
