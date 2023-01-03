import axios from "axios";
import React, { useState, useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import {
  Card,
  Form,
  InputGroup,
  Button,
  Modal,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartReg } from "@fortawesome/free-regular-svg-icons";
import {
  faTrash,
  faEllipsisVertical,
  faPen,
  faHandMiddleFinger as faHandMiddleFingerSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHandPointUp as faHandMiddleFingerReg } from "@fortawesome/free-regular-svg-icons";
import { UserContext } from "../../App";
import PopupModal from "./PopupModal";

const Post = (props) => {
  const { state, dispatch } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(props.post.comments);
  const [likes, setLikes] = useState(props.post.likes.length);
  const [likeStatus, setLikeStatus] = useState(
    props.post.likes.includes(state._id)
  );
  const [delPostModalShow, setDelPostModalShow] = useState(false);
  const [delCommentModalShow, setDelCommentModalShow] = useState(false);

  const handleDelPostModalClose = () => setDelPostModalShow(false);
  const handleDelPostModalShow = () => setDelPostModalShow(true);

  const handleDelCommentModalClose = () => setDelCommentModalShow(false);
  const handleDelCommentModalShow = () => setDelCommentModalShow(true);

  const likePost = (id) => {
    axios
      .put(
        "http://localhost:5000/like",
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
        "http://localhost:5000/unlike",
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

  const makeComment = (text, id) => {
    axios
      .put(
        "http://localhost:5000/comment",
        {
          postId: id,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("Add new comment");
        // console.log(res.data);
        setComment("");
        setAllComments(res.data.comments);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const deletePost = (id) => {
    // console.log("del post api called");
    axios
      .delete(`http://localhost:5000/deletepost/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        // console.log("post deleted");
        props.getPost();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const deleteComment = (postId, commentId) => {
    // console.log("del comment api called");
    axios
      .put(
        `http://localhost:5000/deletecomment/`,
        {
          postId,
          commentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        // console.log("comment deleted");
        setAllComments(res.data.comments);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={props.post.resImgUrl} />
      <Card.Body>
        <Card.Title>{props.post.resName}</Card.Title>
        <Card.Text>{props.post.resLocation}</Card.Text>
        <Card.Text>{props.post.resDetails}</Card.Text>
        <p>{likes} likes</p>
        <FontAwesomeIcon
          icon={likeStatus ? faHandMiddleFingerSolid : faHandMiddleFingerReg}
          onClick={() => {
            if (likeStatus) {
              unlikePost(props.post._id);
            } else {
              likePost(props.post._id);
            }
          }}
        />

        {Array.isArray(allComments) &&
          allComments.map((comment) => {
            return (
              <Card.Text key={comment._id}>
                <strong>{comment.postedBy.name} </strong>
                {comment.text}{" "}
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={handleDelCommentModalShow}
                />
                <PopupModal
                  modalTitle="Delete Comment"
                  modalBody="Are you sure you want to delete the Comment?"
                  post={props.post}
                  delete={() => deleteComment(props.post._id, comment._id)}
                  delModalShow={delCommentModalShow}
                  handleDelModalShow={handleDelCommentModalShow}
                  handleDelModalClose={handleDelCommentModalClose}
                  commentId={comment._id}
                />
              </Card.Text>
            );
          })}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            makeComment(comment, props.post._id);
          }}
        >
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="New comment"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />

              <Button variant="outline-secondary" type="submit">
                Submit
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>
      <Card.Footer>
        <LinkContainer
          to={
            props.post.postedBy._id === state._id
              ? "/Profile"
              : "/Profile/" + props.post.postedBy._id
          }
        >
          <span>{props.post.postedBy.name}</span>
        </LinkContainer>

        {props.post.postedBy._id === state._id && (
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover id="">
                <Popover.Body>
                  <>Delete </>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={handleDelPostModalShow}
                  />
                  <br />
                  <>Edit </>
                  <FontAwesomeIcon icon={faPen} />
                </Popover.Body>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </OverlayTrigger>
        )}
        <PopupModal
          modalTitle="Delete Post"
          modalBody="Are you sure you want to delete the post?"
          post={props.post}
          delete={() => deletePost(props.post._id)}
          delModalShow={delPostModalShow}
          handleDelModalShow={handleDelPostModalShow}
          handleDelModalClose={handleDelPostModalClose}
        />
      </Card.Footer>
    </Card>
  );
};

export default Post;
