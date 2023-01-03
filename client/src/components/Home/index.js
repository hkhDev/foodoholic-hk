import React, { useState, useEffect } from "react";

import Post from "../Post";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = () => {
    axios
      .get("http://localhost:5000/allpost", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("Get post");
        // console.log(res.data.posts);
        setPosts(res.data.posts);
      })
      .catch((error) => {
        console.log(error.response.data);
        // setMessage({ title: "Warning!", body: error.response.data.error });
      });
  };

  const renderPost = () => {
    if (posts.length > 0) {
      return posts.map((post) => (
        <Post key={post._id} post={post} getPost={getAllPost} />
      ));
    }
  };
  return <div>{renderPost()}</div>;
};

export default Home;
