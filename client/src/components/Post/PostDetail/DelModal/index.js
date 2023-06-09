import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./index.scss";
// import { loadingEffect } from "../../../Home";

const DelModal = (props) => {
  // const handleModalClose = () => setModalShow(false);
  // const handleModalShow = () => setModalShow(true);

  return (
    <Modal
      show={props.delModalShow}
      onHide={props.handleDelModalClose}
      className="del-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">{props.modalBody}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleDelModalClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            props.delete();
            props.handleDelModalClose();
          }}
          // onClick={() =>
          //   props.commentId
          //     ? props.props.delete(props.post._id, props.commentId)
          //     : props.props.delete(props.post._id)
          // }
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DelModal;
