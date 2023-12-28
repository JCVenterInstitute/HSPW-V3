import React, { Component } from "react";
import "./index.css";
import jcvi from "../assets/logo-jcvi.svg";
import forsyth from "../assets/logo-forsyth.png";
import uthsc from "../assets/logo-uthsc.svg";
import ub from "../assets/logo-ub.png";
import nih from "../assets/logo-nih-nidcr.png";

class Footer extends Component {
  render() {
    return (
      <div id="footer">
        <div className="footer-top">
          <div className="container">
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
              <ul
                id="last_sentence"
                style={{ marginBottom: "45px" }}
              >
                <li className="last">
                  Project is funded by NIDCR under grant R01 DE016937-16
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    href="about"
                    className="first_li"
                  >
                    About HSPW
                  </a>
                </li>
                <li>
                  <a
                    href="/accessibility"
                    className="middle"
                  >
                    Accessibility
                  </a>
                </li>
                <li>
                  <a
                    href="/copyrights"
                    className="middle"
                  >
                    Copyrights
                  </a>
                </li>
                <li>
                  <a
                    href="/general-disclaimer"
                    className="middle"
                  >
                    Disclaimers
                  </a>
                </li>
                <li className="last">
                  <a
                    href="/privacy-policy"
                    className="last_li"
                  >
                    Privacy Notice
                  </a>
                </li>
              </ul>
              <hr
                className="solid"
                style={{ marginTop: "35px", marginBottom: "35px" }}
              ></hr>
              <ul>
                <li className="address last">
                  By J. Craig Venter Institute, 4120 Capricorn Lane, La Jolla,
                  CA 92037
                </li>
                <li
                  className="last"
                  style={{ marginLeft: "37%" }}
                >
                  <a href="/contact">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
