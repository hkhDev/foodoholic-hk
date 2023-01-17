import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Post from "../Post";
import axios from "axios";

export const loadingEffect = () => {
  return (
    <div className="loading-effect">
      <Spinner animation="grow" /> <Spinner animation="grow" />{" "}
      <Spinner animation="grow" />
    </div>
  );
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = () => {
    axios
      .get("/allpost", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("Get post");
        // console.log(res.data.posts);
        setPosts(res.data.posts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        // setMessage({ title: "Warning!", body: error.response.data.error });
      });
  };

  const renderPost = () => {
    if (posts.length > 0) {
      return posts.map((post) => <Post key={post._id} post={post} />);
    }
  };
  return <div>{isLoading ? loadingEffect() : renderPost()}</div>;
};

export default Home;
