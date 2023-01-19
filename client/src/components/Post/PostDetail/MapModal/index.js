import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import "./index.scss";
// import { loadingEffect } from "../../../Home";

const MapModal = (props) => {
  const [resFullAdress, setResFullAdress] = useState("");
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_Google_Maps_Api_Key,
    libraries,
  });

  const resLatLgg = props.post.resLocationLatLng;

  return (
    <>
      {isLoaded && (
        <Modal
          show={props.mapModalShow}
          onHide={props.handleMapModalClose}
          className="map-modal-background"
          fullscreen={true}
        >
          {/* <Modal.Header closeButton></Modal.Header> */}
          <Modal.Body>
            <GoogleMap
              center={resLatLgg}
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                mapTypeControl: false,
              }}
            >
              <MarkerF position={resLatLgg} />
            </GoogleMap>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.handleMapModalClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default MapModal;
