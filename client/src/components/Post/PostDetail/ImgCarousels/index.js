import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const ImgCarousels = (props) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={5000}>
      {props.imgDetail.map((img, index) => {
        return (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={img.imgUrl} alt="First slide" />
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};
export default ImgCarousels;
