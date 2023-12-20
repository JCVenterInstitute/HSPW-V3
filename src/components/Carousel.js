import React, { useState } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { images } from "./CarouselData.js";
import "./Carousel.css";
import Chord from "./Chord.js";

function Carousel() {
  const [currImg, setCurrImg] = useState(0);
  const stringCheck =
    "The chord diagram on left provides salivary protein catalog with each arc in the diagram represents the set of proteins found in the connected tissue or sample types. Click on Chord image to go to salivary protein catalog page that provides the interactive chord diagram and salivary protein search capability.";

  return (
    <div className="carousel">
      <div
        className="carouselInner"
        style={{ backgroundImage: `url(${images[currImg].img})` }}
      >
        <div
          className="left"
          onClick={() => {
            currImg > 0 && setCurrImg(currImg - 1);
          }}
        >
          <ArrowBackIosIcon style={{ fontSize: 30 }} />
        </div>
        {images[currImg].subtitle === stringCheck && (
          <div>
            {images[currImg].subtitle === stringCheck && (
              <>
                <div
                  style={{
                    float: "left",
                    width: "20%",
                    marginTop: "10%",
                    display: "inline-block",
                  }}
                >
                  <h1
                    sx="text-align:left"
                    className="third_title"
                  >
                    {images[currImg].title}
                  </h1>
                </div>
                <div
                  style={{
                    width: "40%",
                    margin: "0 auto",
                    display: "inline-block",
                    marginTop: "8%",
                  }}
                >
                  <p className="third_paragraph">{images[currImg].subtitle}</p>
                </div>
                <div
                  style={{
                    float: "right",
                    display: "inline-block",
                    width: "40%",
                  }}
                >
                  <Chord />
                </div>
              </>
            )}
          </div>
        )}
        <div>
          {images[currImg].index === 0 && (
            <div className="first_title">
              <h1 style={{ color: "white", textAlign: "left" }}>
                {images[currImg].title}
              </h1>
              <p
                className="first_paragraph"
                style={{ color: "white", textAlign: "left" }}
              >
                {images[currImg].subtitle}
              </p>
            </div>
          )}
          {images[currImg].index === 1 && (
            <>
              <div className="second_title">
                <h1 style={{ color: "white", textAlign: "left" }}>
                  {images[currImg].title}
                </h1>
              </div>
              <p
                className="second_paragraph"
                style={{ color: "white", textAlign: "left" }}
              >
                {images[currImg].subtitle}
              </p>
            </>
          )}
          <p>{images[currImg].subtitle1}</p>
        </div>
        <div
          className="right"
          onClick={() => {
            currImg < images.length - 1 && setCurrImg(currImg + 1);
          }}
        >
          <ArrowForwardIosIcon style={{ fontSize: 30 }} />
        </div>
      </div>
    </div>
  );
}

export default Carousel;
