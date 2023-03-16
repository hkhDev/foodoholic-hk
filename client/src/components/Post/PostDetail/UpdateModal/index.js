import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const UpdateModal = (props) => {
  const [editResName, setEditResName] = useState(props.post.resName);
  // const [editResLocation, setEditResLocation] = useState(
  //   props.post.resLocation
  // );
  const [editResDetails, setEditResDetails] = useState(props.post.resDetails);

  const handleSubmit = async (event) => {
    event.preventDefault();
    props.update(editResName, editResDetails, props.post._id);
    props.handleEditModalClose();
    // setEditResDetails(props.post.resDetails);
  };

  // useEffect(() => {
  //   setEditResDetails(props.post.resDetails);
  // }, [props.post.resDetails]);

  return (
    <Modal show={props.editModalShow} onHide={props.handleEditModalClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicName">
            <FloatingLabel
              controlId="floatingInput"
              label="Restaurant Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Restaurant Name"
                value={editResName}
                onChange={(e) => {
                  setEditResName(e.target.value);
                }}
              />
            </FloatingLabel>
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="formBasicLocation">
            <FloatingLabel
              controlId="floatingInput"
              label="Restaurant Location"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Restaurant Location"
                value={editResLocation}
                onChange={(e) => {
                  setEditResLocation(e.target.value);
                }}
              />
            </FloatingLabel>
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <FloatingLabel
              controlId="floatingPassword"
              label="Restaurant Details"
            >
              <Form.Control
                as="textarea"
                aria-label="With textarea"
                placeholder="Details"
                value={editResDetails}
                onChange={(e) => {
                  setEditResDetails(e.target.value);
                }}
              />
            </FloatingLabel>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleEditModalClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Edit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
