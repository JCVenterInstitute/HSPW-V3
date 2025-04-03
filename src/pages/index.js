import * as React from "react";
import { Helmet } from "react-helmet";
import { Container, Grid, Link } from "@mui/material";

import HomeCarousel from "../components/Home/Carousel/Carousel.js";
import CardComponent from "../components/Shared/Card.js";
import { cardData } from "../data/homePageCards.js";
import HomeBanner from "../components/Home/HomeBanner.js";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>HSP | Home</title>
      </Helmet>
      <div>
        <HomeBanner />
        <HomeCarousel />
        <Container
          maxWidth="xl"
          sx={{
            backgroundColor: "#f9f8f7",
            paddingBottom: "12px",
            borderRadius: "16px",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ marginY: "12px" }}
          >
            {cardData.basicCards.map((props, i) => {
              return (
                <Grid
                  key={i}
                  item
                  xs={12}
                  sm={props.size ? 12 : 6}
                  md={props.size ? 8 : 4}
                  lg={props.size ? 6 : 3}
                >
                  <Link
                    href={props.location}
                    sx={{ textDecoration: "none" }}
                  >
                    <CardComponent
                      rawContent={props.rawContent}
                      title={props.title}
                      blurb={props.blurb}
                      imageSrc={props.imageSrc}
                    />
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default Home;
