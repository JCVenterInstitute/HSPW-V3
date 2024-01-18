import React from "react";
import { contents } from "./CarouselData.js";
import "./Carousel.css";
import Chord from "./Chord.js";
import { Container, CardMedia } from "@mui/material";
import Carousel from "react-material-ui-carousel";

function Banner() {
  return (
    <Carousel
      interval={5000}
      duration={2000}
    >
      {contents.map((content, index) => (
        <CardMedia
          key={index}
          image={content.img}
          title={content.title}
          sx={{
            height: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="xl">
            {content.index === 0 ? (
              <div>
                <p className="first_paragraph">{content.subtitle}</p>
              </div>
            ) : content.index === 1 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1 className="second_title">{content.title}</h1>
                <p className="second_paragraph">{content.subtitle}</p>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "60%" }}>
                  <h1 className="third_title">{content.title}</h1>
                  <p className="third_paragraph">{content.subtitle}</p>
                </div>
                <div className="chord">
                  <Chord />
                </div>
              </div>
            )}
          </Container>
        </CardMedia>
      ))}
    </Carousel>
  );
}

export default Banner;
