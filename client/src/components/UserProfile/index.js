import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Post from "../Post";
import { loadingEffect } from "../Home";
import "./index.scss";

const UserProfile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    getUserPost();
  }, []);

  const getUserPost = () => {
    // console.log("called api");
    axios
      .get(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("Get post");
        // console.log(res.data);
        setUserPosts(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderPost = () => {
    // console.log(userPosts);
    if (userPosts.posts && userPosts.posts.length > 0) {
      return (
        <Row>
          {userPosts.posts.map((post, index) => (
            <Col xl="4" lg="6" key={index}>
              <Post post={post} getPost={getUserPost} />
            </Col>
          ))}
        </Row>
      );
      // userPosts.posts.map((post, index) => (
      //   <Post key={index} post={post} getPost={getUserPost} />
      // ));
    } else {
      return <h2 className="user-profile-title align-center">No Post</h2>;
    }
  };
  return (
    <Container className="user-profile">
      {isLoading ? (
        loadingEffect()
      ) : (
        <>
          <Row className="user-profile-info">
            <Col xs="6" className="user-profile-info-left align-center">
              <Image
                roundedCircle
                fluid
                src={`../images/${userPosts.user.icon}.png`}
                className="profile-img"
              />
            </Col>
            <Col xs="6" className="user-profile-info-right">
              <h1>{userPosts.user && userPosts.user.name}</h1>
              <p>
                <strong>{userPosts.posts.length}</strong> posts
              </p>
            </Col>
          </Row>
          <hr />
          {renderPost()}
        </>
      )}
    </Container>
  );
  // (
  //
  //     <h1>{userPosts.user && userPosts.user.name}</h1>
  //     {renderPost()}
  //
  // );
};

export default UserProfile;
