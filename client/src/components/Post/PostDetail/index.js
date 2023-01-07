import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  InputGroup,
  Button,
  Popover,
  OverlayTrigger,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
// import { faHeart as faHeartReg } from "@fortawesome/free-regular-svg-icons";
import {
  faTrash,
  faEllipsisVertical,
  faPen,
  faCaretDown,
  faHandMiddleFinger as faHandMiddleFingerSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faHandPointUp as faHandMiddleFingerReg,
} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import DelModal from "./DelModal";
import UpdateModal from "./UpdateModal";
import "./index.scss";
import { loadingEffect } from "../../Home";

const PostDetail = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState("");
  const [delCommentModalShow, setDelCommentModalShow] = useState(false);
  const [editPostModalShow, setEditPostModalShow] = useState(false);
  const [delPostModalShow, setDelPostModalShow] = useState(false);
  const { postId } = useParams();

  const handleEditPostModalClose = () => setEditPostModalShow(false);
  const handleEditPostModalShow = () => setEditPostModalShow(true);

  const handleDelPostModalClose = () => setDelPostModalShow(false);
  const handleDelPostModalShow = () => setDelPostModalShow(true);

  const handleDelCommentModalClose = () => setDelCommentModalShow(false);
  const handleDelCommentModalShow = () => setDelCommentModalShow(true);

  const getPost = () => {
    setIsLoading(true);
    axios
      .get(`/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("Get post");
        // console.log(res.data.post);
        setPost(res.data.post);
        setAllComments(res.data.post.comments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        // setMessage({ title: "Warning!", body: error.response.data.error });
      });
  };

  const updatePost = (resName, resLocation, resDetails, id) => {
    setIsLoading(true);
    console.log("calling update com api");
    console.log(id);
    axios
      .put(
        "/updatepost",
        {
          resName,
          resLocation,
          resDetails,
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
        console.log("Post Updated");
        console.log(res.data);
        setPost(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const deletePost = (id) => {
    // console.log("del post api called");
    axios
      .delete(`/deletepost/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        // console.log("post deleted");
        navigate(-1);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const makeComment = (text, id) => {
    axios
      .put(
        "/comment",
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

  const deleteComment = (postId, commentId) => {
    // console.log("del comment api called");
    axios
      .put(
        "/deletecomment/",
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

  useEffect(() => {
    getPost();
    // console.log(post);
  }, []);
  return (
    <>
      {isLoading
        ? loadingEffect()
        : post && (
            <Container fluid>
              <Card className="post-detail">
                <Card.Header>
                  <Row>
                    <Col className="posted-by">
                      <LinkContainer
                        to={
                          post.postedBy._id === state._id
                            ? "/Profile"
                            : "/Profile/" + post.postedBy._id
                        }
                      >
                        <span>{post.postedBy.name} </span>
                      </LinkContainer>
                    </Col>
                    {post.postedBy._id === state._id && (
                      <Col className="posted-by-icon">
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          overlay={
                            <Popover id="">
                              <Popover.Body>
                                <Row>
                                  <Col xs={8}>Delete</Col>
                                  <Col xs={4}>
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      onClick={handleDelPostModalShow}
                                      className="delete-icon"
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={8}>Edit</Col>
                                  <Col xs={4}>
                                    <FontAwesomeIcon
                                      icon={faPen}
                                      onClick={handleEditPostModalShow}
                                      className="edit-icon"
                                    />
                                  </Col>
                                </Row>
                              </Popover.Body>
                            </Popover>
                          }
                        >
                          <FontAwesomeIcon icon={faCaretDown} />
                        </OverlayTrigger>
                      </Col>
                    )}
                  </Row>

                  <DelModal
                    modalTitle="Delete Post"
                    modalBody="Are you sure you want to delete the post?"
                    post={post}
                    delete={() => deletePost(postId)}
                    delModalShow={delPostModalShow}
                    handleDelModalShow={handleDelPostModalShow}
                    handleDelModalClose={handleDelPostModalClose}
                  />
                  <UpdateModal
                    modalTitle="Edit Post"
                    modalBody="Are you sure you want to Edit the post?"
                    post={post}
                    update={updatePost}
                    editModalShow={editPostModalShow}
                    handleEditModalShow={handleEditPostModalShow}
                    handleEditModalClose={handleEditPostModalClose}
                  />
                </Card.Header>
                {/* <Card.Header>Melody</Card.Header> */}
                <Card.Img variant="top" src={post.resImgDetail.imgUrl} />
                <Card.Body>
                  <Card.Title className="res-name">{post.resName}</Card.Title>
                  <Card.Text className="res-location">
                    {post.resLocation}
                    <> / </>
                    {post.postedDate}
                  </Card.Text>
                  <Row>
                    <Card.Text className="res-detail">
                      <LinkContainer
                        to={
                          post.postedBy._id === state._id
                            ? "/Profile"
                            : "/Profile/" + post.postedBy._id
                        }
                      >
                        <strong>{post.postedBy.name} </strong>
                      </LinkContainer>
                      {post.resDetails}
                    </Card.Text>
                  </Row>
                  {Array.isArray(allComments) &&
                    allComments.map((comment) => {
                      return (
                        <Row key={comment._id}>
                          <Col xs={11} className="res-comment">
                            <Card.Text>
                              <LinkContainer
                                to={
                                  comment.postedBy._id === state._id
                                    ? "/Profile"
                                    : "/Profile/" + comment.postedBy._id
                                }
                              >
                                <strong>{comment.postedBy.name} </strong>
                              </LinkContainer>
                              {comment.text}
                            </Card.Text>
                          </Col>
                          <Col xs={1} className="res-comment-delete">
                            {comment.postedBy._id === state._id && (
                              <FontAwesomeIcon
                                icon={faTrash}
                                onClick={handleDelCommentModalShow}
                              />
                            )}
                          </Col>
                          <DelModal
                            modalTitle="Delete Comment"
                            modalBody="Are you sure you want to delete the Comment?"
                            post={post}
                            delete={() => deleteComment(post._id, comment._id)}
                            delModalShow={delCommentModalShow}
                            handleDelModalShow={handleDelCommentModalShow}
                            handleDelModalClose={handleDelCommentModalClose}
                            commentId={comment._id}
                          />
                        </Row>
                      );
                    })}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(comment, postId);
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
              </Card>
            </Container>
          )}
    </>
  );
};

export default PostDetail;
