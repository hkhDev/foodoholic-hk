import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
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
    // console.log(Array.isArray(userPosts.posts));
    // console.log(userPosts.posts.length);
    if (userPosts.posts && userPosts.posts.length > 0) {
      return userPosts.posts.map((post, index) => (
        <Post key={index} post={post} getPost={getUserPost} />
      ));
    } else {
      return <h2>No Post</h2>;
    }
  };
  return (
    <div className="user-profile">
      <h1>{userPosts.user && `${userPosts.user.name}'s Posts`}</h1>
      {isLoading ? loadingEffect() : renderPost()}
    </div>
  );
  // (
  //
  //     <h1>{userPosts.user && userPosts.user.name}</h1>
  //     {renderPost()}
  //
  // );
};

export default UserProfile;
