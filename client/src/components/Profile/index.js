import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import Post from "../Post";

const Profile = () => {
  const [myposts, setMyPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    getMyPost();
  }, []);

  const getMyPost = () => {
    axios
      .get("http://localhost:5000/myposts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Get post");
        console.log(res.data.myposts);
        setMyPosts(res.data.myposts);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderPost = () => {
    if (myposts.length > 0) {
      return myposts.map((post, index) => (
        <Post key={index} post={post} getPost={getMyPost} />
      ));
    } else {
      return (
        <LinkContainer to="/createpost">
          <h2>Create your first post</h2>
        </LinkContainer>
      );
    }
  };
  return (
    <div>
      <h1>{state && state.name}</h1>
      {renderPost()}
    </div>
  );
};

export default Profile;
