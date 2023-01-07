import React, { useState, useEffect } from "react";
import { Button, Form, FloatingLabel } from "react-bootstrap";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        console.log("upload image");
        console.log(res.data);
        // navigate("/Profile");
        // setResImgURl(res.data.secure_url);
        setResImgDetail({
          imgUrl: res.data.secure_url,
          imgId: res.data.public_id,
        });
        // setTimeout(() => {
        //   navigate("/login");
        // }, 1500);
        // return resImgUrl;
      })
      .catch((error) => {
        console.log(error.response.data);
        // setMessage({ title: "Warning!", body: error.response.data.error });
      });
    // uploadPost();
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
        console.log("upload post");
        console.log(res.data);
        // navigate("/Profile");
        setResImg({});
        setResName("");
        setResLocation("");
        setResDetails({});
        // setResImgURl("");
        setResImgDetail();
        navigate("/");
        // setTimeout(() => {
        //   navigate("/login");
        // }, 1500);
      })
      .catch((error) => {
        console.log(error.response.data);
        // setMessage({ title: "Warning!", body: error.response.data.error });
      });
  };

  useEffect(() => {
    if (resImgDetail) {
      uploadPost();
    }
  }, [resImgDetail]);

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Control
            type="file"
            multiple
            onChange={(e) => {
              setResImg(e.target.files[0]);
            }}
          />
          {/* <Figure>
            <Figure.Image
              width={240}
              height={240}
              alt="171x180"
              src="https://t4.ftcdn.net/jpg/04/81/13/43/240_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg"
            />
          </Figure> */}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicName">
          <FloatingLabel
            controlId="floatingInput"
            label="Restaurant Name"
            className="mb-3"
          >
            <Form.Control
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

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreatePost;
