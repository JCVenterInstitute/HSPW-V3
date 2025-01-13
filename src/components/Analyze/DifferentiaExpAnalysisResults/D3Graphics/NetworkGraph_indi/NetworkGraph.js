import React, { useEffect, useState } from "react";
import cytoscape from "cytoscape";
import Select from "react-select";
import "./NetworkGraph.css";
import { saveAs } from "file-saver"; //or require

// Function for creating color based on log2.FC value
const getNodeColor = (log2FC, inDataFile) => {
  if (log2FC > 1.0) {
    const redValue = Math.min(255, 230 + (log2FC - 1) * 30);
    return `rgb(${Math.round(redValue)}, 0, 0)`; // Exact red tones
  } else if (log2FC < -1.0) {
    return `rgb(100, ${Math.min(255, 150 + (-log2FC - 1) * 30)}, 100)`; // Shades of green
  } else {
    return "#FFD700"; // Yellow for in-between range
  }
};

const calculateMinLog2FC = (data) => {
  let minLog2FC = 0;
  data.forEach((item) => {
    const log2FC = parseFloat(item["log2.FC"]);
    if (!isNaN(log2FC) && log2FC < minLog2FC) {
      minLog2FC = log2FC;
    }
  });
  return minLog2FC;
};

// Function to process the data into Cytoscape elements with filtering and duplicate edge handling
const processData = (data, pValueThreshold, fdrThreshold, log2FCThreshold) => {
  const elements = [];
  const addedNodes = new Set();
  const addedEdges = new Set(); // Set to store added edges to prevent duplicates

  data.forEach((item) => {
    const primaryGene = item["Gene.Names..primary."];
    const interactingGenes = item["Genes.interacting"]
      ? item["Genes.interacting"].split(", ")
      : [];

    const pValue = parseFloat(item["p.value"]);
    const fdr = parseFloat(item["FDR"]);
    const log2FC = parseFloat(item["log2.FC."]);
    const inDataFile = item.inDataFile || false; // Boolean flag for all_data.tsv inclusion

    // Apply filters for p.value, FDR, and log2.FC
    if (
      pValue > pValueThreshold ||
      fdr > fdrThreshold ||
      log2FC < log2FCThreshold
    ) {
      return; // Skip this entry if it doesn't match the filters
    }

    if (!addedNodes.has(primaryGene)) {
      elements.push({
        data: {
          id: primaryGene,
          label: `${primaryGene}`, // Show gene name and log2.FC value
        },
        classes: "primary-gene",
        style: { "background-color": getNodeColor(log2FC, inDataFile) },
      });
      addedNodes.add(primaryGene);
    }

    interactingGenes.forEach((gene) => {
      if (!addedNodes.has(gene)) {
        elements.push({
          data: {
            id: gene,
            label: `${gene}`, // Show gene name and log2.FC value
          },
          classes: "interacting-gene",
          style: { "background-color": getNodeColor(log2FC, inDataFile) },
        });
        addedNodes.add(gene);
      }

      // Ensure bidirectional edges are not duplicated
      const edgeKey1 = `${primaryGene}-${gene}`;
      const edgeKey2 = `${gene}-${primaryGene}`;

      if (!addedEdges.has(edgeKey1) && !addedEdges.has(edgeKey2)) {
        elements.push({
          data: { source: primaryGene, target: gene },
          classes: "interaction-edge",
        });
        addedEdges.add(edgeKey1);
      }
    });
  });

  return elements;
};

const NetworkGraph = ({ data }) => {
  const [cy, setCy] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [pValueThreshold, setPValueThreshold] = useState(0.5);
  const [fdrThreshold, setFDRThreshold] = useState(0.7);
  const [log2FCThreshold, setLog2FCThreshold] = useState(5.0);
  const [selectedLayout, setSelectedLayout] = useState("grid");
  const [minLog2FC, setMinLog2FC] = useState(0);

  useEffect(() => {
    // Calculate minimum log2.FC when data is loaded
    if (data?.length > 0) {
      const minLog2FCValue = calculateMinLog2FC(data);
      setMinLog2FC(minLog2FCValue);
      setLog2FCThreshold(minLog2FCValue); // Set initial threshold to minimum
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const elements = processData(
        data,
        pValueThreshold,
        fdrThreshold,
        log2FCThreshold
      );

      const cyInstance = cytoscape({
        container: document.getElementById("cy"),
        elements: elements,
        style: [
          {
            selector: ".primary-gene",
            style: {
              height: 40,
              width: 40,
              label: "data(label)",
              "text-wrap": "wrap", // Enable wrapping
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "12px",
              "font-weight": "bolder",
              color: "#000",
            },
          },
          {
            selector: ".interacting-gene",
            style: {
              height: 40,
              width: 40,
              label: "data(label)",
              "text-wrap": "wrap", // Enable wrapping
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "12px",
              "font-weight": "bolder",
              color: "#000",
            },
          },
          {
            selector: ".interaction-edge",
            style: {
              width: 1, // Reduced thickness
              "line-color": "#808080", // Uniform edge color
              "curve-style": "haystack",
              "haystack-radius": 0,
              opacity: 0.6,
            },
          },
        ],
        layout: {
          name: selectedLayout,
          fit: true,
        },
        userZoomingEnabled: true,
        userPanningEnabled: true,
      });

      setCy(cyInstance);

      return () => {
        if (cyInstance) {
          cyInstance.destroy();
        }
      };
    }
  }, [data, pValueThreshold, fdrThreshold, log2FCThreshold, selectedLayout]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (cy) {
      const node = cy.getElementById(inputValue.toUpperCase());
      if (node.length) {
        cy.elements().removeClass("highlighted");
        node.addClass("highlighted");
        setTimeout(() => {
          node.removeClass("highlighted");
        }, 1500); // Highlight for 1.5 seconds
        cy.zoom(1); // Reset zoom
        cy.pan({
          x: cy.width() / 2 - node.position().x,
          y: cy.height() / 2 - node.position().y,
        });
        setMessage("");
      } else {
        setMessage("Gene not found.");
      }
    }
  };

  const handleLayoutChange = (selectedOption) => {
    setSelectedLayout(selectedOption.value);
  };

  const downloadImage = () => {
    saveAs(cy.png(), "network-analysis.png");
  };

  const layoutOptions = [
    { value: "circle", label: "Circle" },
    { value: "grid", label: "Grid" },
    { value: "breadthfirst", label: "Breadthfirst" },
    { value: "concentric", label: "Concentric" },
    { value: "random", label: "Random" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <input
            type="text"
            placeholder="Search Gene..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="input-field"
          />
          <button
            onClick={handleSearch}
            className="search-button"
          >
            Search
          </button>
          {message && <p className="message">{message}</p>}
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ margin: "0px 5px 0px 0px" }}>
            <button
              onClick={downloadImage}
              className="search-button"
            >
              Download
            </button>
          </div>
          <div>
            <Select
              options={layoutOptions}
              onChange={handleLayoutChange}
              placeholder="Select Layout"
              className="layout-dropdown"
            />
          </div>
        </div>
      </div>

      {/* Sliders for p.value, FDR, log2.FC */}
      <div
        className="slider-controls"
        style={{ marginTop: 20 }}
      >
        <label style={{ paddingRight: 50 }}>
          p.value:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={pValueThreshold}
            onChange={(e) => setPValueThreshold(e.target.value)}
          />
          {pValueThreshold}
        </label>
        <label style={{ paddingRight: 50 }}>
          FDR:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={fdrThreshold}
            onChange={(e) => setFDRThreshold(e.target.value)}
          />
          {fdrThreshold}
        </label>
        <label style={{ paddingRight: 50 }}>
          log2.FC:
          <input
            type="range"
            min={minLog2FC}
            max="10"
            step="0.01"
            value={log2FCThreshold}
            onChange={(e) => setLog2FCThreshold(e.target.value)}
          />
          {log2FCThreshold}
        </label>
      </div>
      <div
        className="legend-container"
        style={{
          display: "flex",
          flexDirection: "row", // Ensures elements are aligned in a single line
          justifyContent: "flex-end", // Aligns the entire box to the right
          padding: "10px 20px", // Adds padding to the box
          // border: "1px solid #ccc", // Adds a border around the legend
          // borderRadius: "5px", // Rounds the corners of the box
          marginTop: "10px", // Adds spacing above the box
          // backgroundColor: "#f9f9f9", // Light background for the legend box
        }}
      >
        <div
          className="legend-heading"
          style={{
            marginRight: "20px",
            fontWeight: "bold",
            alignSelf: "center", // Vertically aligns the heading with the items
          }}
        >
          Legend:
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "15px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#FF0000",
              marginRight: "10px",
            }}
          ></div>
          <span>log2.FC &gt; 1.0 (Red)</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "15px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#00FF00",
              marginRight: "10px",
            }}
          ></div>
          <span>log2.FC &lt; -1.0 (Green)</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#FFD700",
              marginRight: "10px",
            }}
          ></div>
          <span>-1.0 ≤ log2.FC ≤ 1.0 (Yellow)</span>
        </div>
      </div>
      <div
        id="cy"
        style={{ width: "100%", height: "1000px" }}
      ></div>
    </div>
  );
};

export default NetworkGraph;
