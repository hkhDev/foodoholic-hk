import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Post from "../Post";
import { loadingEffect } from "../Home";
import "./index.scss";

const Profile = () => {
  const navigate = useNavigate();
  const [myposts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    getMyPost();
  }, []);
  console.log(myposts);

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
      return (
        <Row>
          {myposts.map((post, index) => (
            <Col xl="4" lg="6">
              <Post key={index} post={post} getPost={getMyPost} />
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
                src="images/man.png"
                className="profile-img"
              />
            </Col>
            <Col xs="6" className="profile-info-right ">
              <h1>{state && state.name}</h1>
              <p>
                <strong>{myposts.length}</strong> posts
              </p>
            </Col>
          </Row>
          <hr />
          {renderPost()}
        </>
      )}
    </Container>
  );
};

export default Profile;
