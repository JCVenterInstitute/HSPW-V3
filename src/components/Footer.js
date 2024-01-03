import React from "react";
import "./index.css";
import jcvi from "../assets/logo-jcvi.svg";
import forsyth from "../assets/logo-forsyth.png";
import uthsc from "../assets/logo-uthsc.svg";
import ub from "../assets/logo-ub.png";
import nih from "../assets/logo-nih-nidcr.png";
import { Container, Grid, Link, Typography } from "@mui/material";

const Footer = () => {
  const links = [
    { href: "/about", text: "About HSPW" },
    { href: "/accessibility", text: "Accessibility" },
    { href: "/copyrights", text: "Copyrights" },
    { href: "/disclaimers", text: "Disclaimers" },
    { href: "/privacy-policy", text: "Privacy Notice" },
    { href: "/contact", text: "Contact Us" },
  ];

  return (
    <div className="footer-container">
      <Container maxWidth="false">
        <div id="footer-logos">
          <ul>
            <li>
              <a
                href="http://www.jcvi.org"
                title="JCVI Homepage"
                alt="JCVI Homepage"
              >
                <img
                  src={jcvi}
                  alt="JCVI Logo"
                />
              </a>
            </li>
            <li>
              <a
                href="http://www.forsyth.org"
                title="The Forsyth Institute Homepage"
                alt="The Forsyth Institute Homepage"
              >
                <img
                  src={forsyth}
                  alt="Forsyth Logo"
                />
              </a>
            </li>
            <li>
              <a
                href="http://www.uthsc.edu"
                title="The University of Tennessee Health Science Center Homepage"
                alt="The University of Tennessee Health Science Center Homepage"
              >
                <img
                  src={uthsc}
                  alt="University of Tennessee Health Center Logo"
                />
              </a>
            </li>
            <li>
              <a
                href="http://www.buffalo.edu"
                title="University of Buffalo Homepage"
                alt="University of Buffalo Homepage"
              >
                <img
                  src={ub}
                  alt="University of Buffalo Logo"
                />
              </a>
            </li>
            <li>
              <a
                href="http://www.nih.gov"
                title="NIH Homepage"
                alt="NIH Homepage"
              >
                <img
                  src={nih}
                  alt="NIH Logo"
                />
              </a>
            </li>
          </ul>
        </div>
        <div id="footer-text">
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              container
              justifyContent="space-evenly"
            >
              {links.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Grid item>
                      <Typography
                        component="span"
                        sx={{
                          mx: 4,
                          fontFamily: "Montserrat",
                          color: "#6C6C6C",
                        }}
                      >
                        |
                      </Typography>
                    </Grid>
                  )}
                  <Grid item>
                    <Link
                      href={link.href}
                      underline="none"
                    >
                      {link.text}
                    </Link>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
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
              sx={{ ml: 2, mr: 2, mb: 4 }}
            >
              <Grid item>
                <p className="address last">
                  By J. Craig Venter Institute, 4120 Capricorn Lane, La Jolla,
                  CA 92037
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
