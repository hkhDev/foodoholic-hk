import axios from "axios";
import React, { useState, useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faHandMiddleFinger as faHandMiddleFingerSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faHandPointUp as faHandMiddleFingerReg,
} from "@fortawesome/free-regular-svg-icons";
import { UserContext } from "../../App";

const Post = (props) => {
  const { state, dispatch } = useContext(UserContext);
  const [likes, setLikes] = useState(props.post.likes.length);
  const [likeStatus, setLikeStatus] = useState(
    props.post.likes.includes(state._id)
  );

  const postCreatedAt = new Date(props.post.createdAt).toLocaleDateString(
    "en",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const likePost = (id) => {
    axios
      .put(
        "/like",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("like");
        setLikes(res.data.likes.length);
        setLikeStatus(res.data.likes.includes(state._id));
        // console.log(res);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const unlikePost = (id) => {
    axios
      .put(
        "/unlike",
        {
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("unlike");
        // console.log(res);
        setLikes(res.data.likes.length);
        setLikeStatus(res.data.likes.includes(state._id));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <Card style={{ width: "18rem" }}>
      <LinkContainer to={`/post/${props.post._id}`}>
        <Card.Img variant="top" src={props.post.resImgsDetail[0].imgUrl} />
      </LinkContainer>
      <Card.Body>
        <Card.Title>{props.post.resName}</Card.Title>
        <Card.Text>
          <FontAwesomeIcon icon={faLocationDot} /> {props.post.resLocation}
        </Card.Text>
        <Container>
          <Row>
            <Col></Col>
            <Col>
              <FontAwesomeIcon
                icon={
                  likeStatus ? faHandMiddleFingerSolid : faHandMiddleFingerReg
                }
                onClick={() => {
                  if (likeStatus) {
                    unlikePost(props.post._id);
                  } else {
                    likePost(props.post._id);
                  }
                }}
              />
              <> </>
              {likes}
            </Col>
            <Col>
              <LinkContainer to={`/post/${props.post._id}`}>
                <FontAwesomeIcon icon={faComment} />
              </LinkContainer>{" "}
              {props.post.comments.length}
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </Card.Body>

      <Card.Footer>
        <LinkContainer
          to={
            props.post.postedBy._id === state._id
              ? "/Profile"
              : "/Profile/" + props.post.postedBy._id
          }
        >
          <span>
            by <strong>{props.post.postedBy.name}</strong> / {postCreatedAt}
          </span>
        </LinkContainer>
      </Card.Footer>
    </Card>
  );
};

export default Post;
