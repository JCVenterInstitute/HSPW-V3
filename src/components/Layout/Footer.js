import React from "react";
import { Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import JCVI from "@Assets/logo/logo-jcvi.svg";
import Forsyth from "@Assets/logo/logo-forsyth.png";
import UTHSC from "@Assets/logo/logo-uthsc.svg";
import UB from "@Assets/logo/logo-ub.png";
import NIH from "@Assets/logo/logo-nih-nidcr.png";
import "../index.css";

const Footer = () => {
  const links = [
    { href: "/about", text: "About HSP" },
    { href: "/accessibility", text: "Accessibility" },
    { href: "/copyrights", text: "Copyrights" },
    { href: "/disclaimers", text: "Disclaimers" },
    { href: "/privacy-policy", text: "Privacy Notice" },
    { href: "/contact", text: "Contact Us" },
  ];

  const logos = [
    {
      href: "http://www.jcvi.org",
      title: "JCVI Homepage",
      altText: "JCVI Homepage",
      image: JCVI,
    },
    {
      href: "http://www.forsyth.org",
      title: "The Forsyth Institute Homepage",
      altText: "The Forsyth Institute Homepage",
      image: Forsyth,
    },
    {
      href: "http://www.uthsc.edu",
      title: "The University of Tennessee Health Science Center Homepage",
      altText: "The University of Tennessee Health Science Center Homepage",
      image: UTHSC,
    },
    {
      href: "http://www.buffalo.edu",
      title: "University of Buffalo Homepage",
      altText: "University of Buffalo Homepage",
      image: UB,
    },
    {
      href: "http://www.nih.gov",
      title: "NIH Homepage",
      altText: "NIH Homepage",
      image: NIH,
    },
  ];

  return (
    <div className="footer-container">
      <Container maxWidth="xl">
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "space-evenly",
            padding: 0,
            marginTop: "5px",
            marginBottom: "5px",
          }}
        >
          {logos.map((logo, index) => {
            return (
              <Grid
                key={index}
                item
                xs={6}
                sm={4}
                md={4}
                lg={2}
                className="logo-grid"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link
                  to={logo.href}
                  target="_blank"
                >
                  <img
                    src={logo.image}
                    alt={logo.altText}
                    style={{
                      maxWidth: "250px",
                    }}
                  />
                </Link>
              </Grid>
            );
          })}
        </Grid>
        <div id="footer-text">
          <Grid
            container
            spacing={3}
          >
            {links.map((link, index) => (
              <Grid
                key={index}
                item
                container
                justifyContent="space-evenly"
                xs={6}
                sm={4}
                md={4}
                lg={2}
              >
                <Link
                  to={link.href}
                  style={{
                    fontSize: "16px",
                    textDecoration: "none",
                  }}
                >
                  {link.text}
                </Link>
              </Grid>
            ))}
          </Grid>
          <div
            style={{
              height: "3px",
              background: "#C9C9C9",
              margin: "30px 0",
            }}
          ></div>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              container
              justifyContent="space-between"
              sx={{
                ml: 2,
                mr: 2,
                mb: 4,
              }}
            >
              <Grid
                item
                sx={{ mb: { xs: 2, sm: 2 } }}
              >
                <p className="address last">
                  J. Craig Venter Institute, 4120 Capricorn Lane, La Jolla, CA
                  92037
                </p>
              </Grid>
              <Grid item>
                <p className="address last">
                  Project is funded by NIDCR under grant R01 DE016937-16
                </p>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
