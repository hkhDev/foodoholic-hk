import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Post from "../Post";
import "./index.scss";

const Search = () => {
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("Select");
  const [searchText, setSearchtext] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [resultUser, setResultUser] = useState([]);
  const [resultPost, setResultPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchText && (searchParam === "user" ? searchUser() : searchRes());
  };

  const searchUser = () => {
    setIsLoading(true);
    axios
      .post(
        `/searchuser`,
        { searchText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res.data.user);
        setResultPost();
        setResultUser(res.data.user);
        setIsLoading(false);
        setSearchStatus(true);
        // console.log(res.data.myposts);
        // setMyPosts(res.data.myposts);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchRes = () => {
    setIsLoading(true);
    axios
      .post(
        `/searchres`,
        { searchParam, searchText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res.data.post);
        setResultUser();
        setResultPost(res.data.post);
        setIsLoading(false);
        setSearchStatus(true);
        // console.log(res.data.myposts);
        // setMyPosts(res.data.myposts);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    switch (searchParam) {
      case "user":
        setSearchValue("User");
        // console.log("User");
        break;
      case "resName":
        setSearchValue("Restaurant Name");
        // console.log("Name");
        break;
      // case "resLocation":
      //   setSearchValue("Restaurant Location");
      //   // console.log("Location");
      //   break;
    }
  }, [searchParam]);

  return (
    <Container className="search-body">
      <Form onSubmit={handleSubmit}>
        <Form.Label>Search by</Form.Label>
        <InputGroup className="mb-3">
          <DropdownButton
            variant="outline-secondary"
            title={searchValue}
            id="input-group-dropdown-1"
            onChange={(e) => console.log(e.target.value)}
          >
            <Dropdown.Item
              onClick={(e) => {
                setSearchParam("user");
              }}
            >
              User
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                setSearchParam("resName");
              }}
            >
              Restaurant Name
            </Dropdown.Item>
            {/* <Dropdown.Item
              onClick={(e) => {
                setSearchParam("resLocation");
              }}
            >
              Restaurant Location
            </Dropdown.Item> */}
          </DropdownButton>
          <Form.Control
            aria-label="Text input with dropdown button"
            value={searchText}
            onChange={(e) => {
              setSearchtext(e.target.value);
            }}
            disabled={searchValue === "Select" ? true : false}
          />
        </InputGroup>
        {isLoading ? (
          <Button variant="primary" type="submit" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Searching...
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Search
          </Button>
        )}
      </Form>
      {resultUser &&
        searchStatus &&
        (resultUser.length > 0 ? (
          <Row>
            {resultUser.map((user, index) => {
              return (
                <LinkContainer
                  key={index}
                  to={"/Profile/" + user._id}
                  className="hand-cursor"
                >
                  <Col
                    key={index}
                    xl="3"
                    lg="4"
                    md="6"
                    className="align-center
              "
                  >
                    <>
                      <Image
                        roundedCircle
                        fluid
                        src={`images/${user.icon}.png`}
                        className="search-result"
                      />
                      <h3>{user.name}</h3>
                    </>
                    {/* <Link
                    to={"/Profile/" + user._id}
                    className="search-card-link"
                  >
                    <>
                      Visit <FontAwesomeIcon icon={faArrowRight} />
                    </>
                  </Link> */}
                  </Col>
                </LinkContainer>
              );
            })}
          </Row>
        ) : (
          <h3 className="search-result">No user found</h3>
        ))}
      {resultPost &&
        searchStatus &&
        (resultPost.length > 0 ? (
          resultPost.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <h3 className="search-result">No restaurant found</h3>
        ))}
    </Container>
  );
};

export default Search;
