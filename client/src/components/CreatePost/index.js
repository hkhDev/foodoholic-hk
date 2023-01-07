import React, { useState, useEffect } from "react";
import { Button, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { LinkContainer } from "react-router-bootstrap";

const CreatePost = () => {
  const navigate = useNavigate();
  const [resImg, setResImg] = useState({});
  const [resName, setResName] = useState("");
  const [resLocation, setResLocation] = useState("");
  const [resDetails, setResDetails] = useState("");
  const [resImgDetail, setResImgDetail] = useState();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      // event.stopPropagation();
    } else {
      uploadImg(event);
    }
    setValidated(true);
  };

  const uploadImg = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", resImg);
    formData.append("upload_preset", "food-review");
    formData.append("cloud-name", "harriscloud");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/harriscloud/image/upload",
        formData
      )
      .then((res) => {
        // console.log("upload image");
        // console.log(res.data);
        setResImgDetail({
          imgUrl: res.data.secure_url,
          imgId: res.data.public_id,
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        // setMessage({ title: "Warning!", body: error.response.data.error });
      });
  };

  const uploadPost = () => {
    axios
      .post(
        "/createpost",
        {
          resName,
          resLocation,
          resDetails,
          resImgDetail,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("upload post");
        // console.log(res.data);
        setResImg({});
        setResName("");
        setResLocation("");
        setResDetails({});
        setResImgDetail();
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  useEffect(() => {
    if (resImgDetail) {
      uploadPost();
    }
  }, [resImgDetail]);

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="validationCustom01">
          <Form.Control
            required
            type="file"
            multiple
            onChange={(e) => {
              setResImg(e.target.files[0]);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicName">
          <FloatingLabel
            controlId="floatingInput"
            label="Restaurant Name"
            className="mb-3"
          >
            <Form.Control
              required
              type="text"
              placeholder="Restaurant Name"
              value={resName}
              onChange={(e) => {
                setResName(e.target.value);
              }}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicLocation">
          <FloatingLabel
            controlId="floatingInput"
            label="Restaurant Location"
            className="mb-3"
          >
            <Form.Control
              required
              type="text"
              placeholder="Restaurant Location"
              value={resLocation}
              onChange={(e) => {
                setResLocation(e.target.value);
              }}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <FloatingLabel controlId="floatingPassword" label="Details">
            <Form.Control
              required
              as="textarea"
              aria-label="With textarea"
              placeholder="Details"
              value={resDetails}
              onChange={(e) => {
                setResDetails(e.target.value);
              }}
            />
          </FloatingLabel>
        </Form.Group>

        {isLoading ? (
          <Button variant="primary" type="submit" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Uploading...
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        )}
      </Form>
    </div>
  );
};

export default CreatePost;
