import React from "react";
import AgGrid from "../../components/Download/DownloadTable.js";
import "../style.css";
import { components } from "react-select";

import main_feature from "../page_main.png";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const Download = () => {
  return (
    <>
      <div
        style={{
          height: "40%",
          padding: "35px",
          backgroundImage: `url(${main_feature})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
          }}
          className="title"
          align="left"
        >
          DATA DOWNLOAD
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
          className="head_text"
        >
          Search and Download data in Zip, MzTab and Metadata Formats. *If you
          cite or display any content, or reference our organization, in any
          format Please follow these guidelines: Include a reference to a
          Primary publication: The Human Salivary Proteome Wiki: A Community
          Driven Research Platform OR Include a reference to our website:
          SalivaryProteome.org
        </p>
      </div>

      <AgGrid />
    </>
  );
};

export default Download;
