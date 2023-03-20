import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const SelectIconModal = (props) => {
  const iconArr = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <Modal show={props.iconModalShow} onHide={props.handleIconModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Icon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            {iconArr.map((icon, index) => {
              const iconName = `icon${icon}`;
              return (
                <Col key={index} tabIndex={icon} xs="3">
                  <div
                    className="signup-select-icon"
                    onClick={() => {
                      props.setIcon(iconName);
                      props.handleIconModalClose();
                    }}
                  >
                    <Image
                      roundedCircle
                      fluid
                      src={`/images/${iconName}.png`}
                    />
                  </div>
                </Col>
              );
            })}
            <div className="align-center signup-icon-attribution">
              <a
                href="https://iconscout.com/icons/avatar"
                target="_blank"
                className="signup-icon-attribution-link"
              >
                Avatar Icon
              </a>{" "}
              by{" "}
              <a
                href="https://iconscout.com/contributors/dmitriy-bondarchuk"
                target="_blank"
                className="signup-icon-attribution-link"
              >
                Dmitriy Bondarchuk
              </a>
            </div>
          </Row>
        </Container>
      </Modal.Body>
      {/* <Modal.Footer>
    <Button variant="primary">Select</Button>
    <Button
      variant="outline-danger"
      onClick={handleIconModalClose}
    >
      Close
    </Button>
  </Modal.Footer> */}
    </Modal>
  );
};

export default SelectIconModal;
