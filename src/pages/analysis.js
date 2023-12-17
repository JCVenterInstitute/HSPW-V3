import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { components } from "react-select";
import "react-tabs/style/react-tabs.css";
import { saveAs } from "file-saver";

import Analysis_Filter from "../components/analysis_filter.js";
import Table from "../components/csv_to_json_table.js";
import heatmap from "../assets/top100var_heatmap_626170.png";
import "./style.css";

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

const colourOptions = [
  { value: "ocean1", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

const downloadImage = () => {
  saveAs(
    "https://timesofindia.indiatimes.com/thumb/msid-70238371,imgsize-89579,width-400,resizemode-4/70238371.jpg",
    "image.png"
  ); // Put your image url here.
};

const Analysis = () => {
  return (
    <>
      <div className="rowC">
        <div className="sidebar">
          <div style={{ backgroundColor: "#254A61" }}>
            <h2
              style={{
                color: "white",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              Analysis
            </h2>
          </div>
          <Analysis_Filter />
        </div>
        <div className="charts">
          <div style={{ margin: "10px" }}>
            <h2>Sample Normalization</h2>
            <input
              type="checkbox"
              id="normalization1"
              name="normalization1"
              value="z-score"
              style={{ margin: "10px" }}
            />
            <label for="normalization1">Z-Score</label>
            <br />
            <input
              type="checkbox"
              id="normalization2"
              name="normalization2"
              value="rank"
              style={{ margin: "10px" }}
            />
            <label for="normalization2">Rank</label>
            <br />
            <input
              type="checkbox"
              id="normalization3"
              name="normalization3"
              value="median"
              style={{ margin: "10px" }}
            />
            <label for="normalization3">Median</label>
            <br />
            <input
              type="checkbox"
              id="normalization4"
              name="normalization4"
              value="sum"
              style={{ margin: "10px" }}
            />
            <label for="normalization4">Sum</label>
            <br />
          </div>
          <div style={{ margin: "10px" }}>
            <h2>Sample Filtering</h2>
            <input
              type="checkbox"
              id="filtering1"
              name="filtering1"
              value="IR"
              style={{ margin: "10px" }}
            />
            <label for="filtering1">Interquartile Range</label>
            <br />
            <input
              type="checkbox"
              id="filtering2"
              name="filtering2"
              value="SD"
              style={{ margin: "10px" }}
            />
            <label for="filtering2">Standard deviation</label>
            <br />
            <input
              type="checkbox"
              id="filtering3"
              name="filtering3"
              value="MAD"
              style={{ margin: "10px" }}
            />
            <label for="filtering3">Median absolute deviation</label>
            <br />
            <input
              type="checkbox"
              id="filtering4"
              name="filtering4"
              value="NPRSD"
              style={{ margin: "10px" }}
            />
            <label for="filtering4">
              Non-parametric relative standard deviation
            </label>
            <br />
            <input
              type="checkbox"
              id="filtering5"
              name="filtering5"
              value="MeanIV"
              style={{ margin: "10px" }}
            />
            <label for="filtering4">Mean intensity value</label>
            <br />
            <input
              type="checkbox"
              id="filtering6"
              name="filtering6"
              value="MedianIV"
              style={{ margin: "10px" }}
            />
            <label for="filtering4">Median intensity value</label>
            <br />
          </div>
          <div style={{ margin: "10px" }}>
            <h2>Visualization</h2>
            <input
              type="checkbox"
              id="filtering1"
              name="filtering1"
              value="IR"
              style={{ margin: "10px" }}
            />
            <label for="filtering1">Volcano Plot</label>
            <br />
            <input
              type="checkbox"
              id="filtering2"
              name="filtering2"
              value="SD"
              style={{ margin: "10px" }}
            />
            <label for="filtering2">Heatmap</label>
            <br />
          </div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "8em",
              marginTop: "7rem",
            }}
          >
            <input
              type="submit"
              value="Submit"
              style={{ marginLeft: "auto", marginRight: "auto", width: "8em" }}
            ></input>
          </div>
        </div>
      </div>
      <h2>hi</h2>
      <div style={{ marginLeft: "250px" }}>
        <Tabs>
          <TabList>
            <Tab>Data</Tab>
            <Tab>Visualization</Tab>
            <Tab></Tab>
          </TabList>

          <TabPanel>
            <Table />
          </TabPanel>
          <TabPanel>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "10em",
                marginTop: "2rem",
              }}
            >
              <button
                onClick={downloadImage}
                style={{ width: "10em" }}
              >
                Export
              </button>
            </div>
            <img src={heatmap} />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default Analysis;
