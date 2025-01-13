import React, { useEffect, useState } from "react";
import cytoscape from "cytoscape";
import Select from "react-select";

import "./NetworkGraph.css";

// Function for creating random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to process the data into Cytoscape elements
const processData = (data) => {
  const elements = [];
  const addedNodes = new Set();

  data.forEach((item, index) => {
    const propertyId = `property-${index}`;
    if (!addedNodes.has(propertyId)) {
      elements.push({
        data: { id: propertyId, label: item.property },
        classes: "property",
      });
      addedNodes.add(propertyId);
    }

    const proteins = item.protein.split(", ");
    proteins.forEach((protein) => {
      if (!addedNodes.has(protein)) {
        elements.push({
          data: { id: protein, label: protein },
          classes: "protein",
        });
        addedNodes.add(protein);
      }

      elements.push({
        data: { source: propertyId, target: protein, color: item.color },
        classes: "edge",
      });
    });
  });

  return elements;
};

const NetworkGraph = ({ plotData }) => {
  const [cy, setCy] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState("circle");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = plotData.map((d) => ({
          property: d.Description,
          protein: d.geneID.replace(/"/g, "").replace(/\//g, ", "),
          color: getRandomColor(), // Default color if not provided
        }));
        setData(jsonData);
        const allProperties = jsonData.map((item) => item.property);
        setSelectedProperties(allProperties);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [plotData]);

  useEffect(() => {
    if (data.length > 0 && selectedProperties.length > 0) {
      const filteredData = data.filter((item) =>
        selectedProperties.includes(item.property)
      );
      const elements = processData(filteredData);

      const cyInstance = cytoscape({
        container: document.getElementById("cy"),
        elements: elements,
        style: [
          {
            selector: ".property",
            style: {
              height: 40,
              width: 40,
              "background-color": "#f7fc88",
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "16px",
              color: "#000",
            },
          },
          {
            selector: ".protein",
            style: {
              height: 20,
              width: 20,
              "background-color": "#5f99f5",
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "16px",
              color: "#000",
            },
          },
          {
            selector: ".edge",
            style: {
              "curve-style": "haystack",
              "haystack-radius": 0,
              width: 2,
              opacity: 0.5,
              "line-color": "data(color)",
            },
          },
          {
            selector: ".highlighted",
            style: {
              "background-color": "#FFD700",
              "border-width": 2,
              "border-color": "#FF4500",
              "transition-property": "background-color, border-color",
              "transition-duration": "0.5s",
            },
          },
        ],
        layout: {
          name: selectedLayout,
          fit: true,
        },
        userZoomingEnabled: true, // Enable zooming
        userPanningEnabled: true, // Enable panning
        zoomingSpeed: 0.1, // Reduce the zooming speed
      });

      setCy(cyInstance);

      return () => {
        if (cyInstance) {
          cyInstance.destroy();
        }
      };
    }
  }, [data, selectedProperties, selectedLayout]);

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
        }, 1500); // Keep the highlight for 1.5 seconds

        // Reset zoom to a default level (e.g., 1) to avoid excessive zooming
        cy.zoom(1);

        // Pan the graph to center the node on the screen with slight offset to keep it visible
        const nodePosition = node.position();
        const newPan = {
          x: cy.width() / 2 - nodePosition.x,
          y: cy.height() / 2 - nodePosition.y - 100, // Adjust this value to control vertical position
        };
        cy.pan(newPan);

        setMessage("");
      } else {
        setMessage("Protein not found.");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handlePropertyChange = (selectedOptions) => {
    const selected = selectedOptions.map((option) => option.value);
    setSelectedProperties(selected);
  };

  const handleLayoutChange = (selectedOption) => {
    setSelectedLayout(selectedOption.value);
  };

  // Extract unique properties for the dropdown options
  const propertyOptions = [...new Set(data.map((d) => d.property))].map(
    (property) => ({
      value: property,
      label: property,
    })
  );

  const layoutOptions = [
    { value: "circle", label: "Circle" },
    { value: "grid", label: "Grid" },
    { value: "breadthfirst", label: "Breadthfirst" },
    { value: "concentric", label: "Concentric" },
    { value: "random", label: "Random" },
  ];

  return (
    <div style={{ width: "100%", height: "70%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <input
            type="text"
            placeholder="Search Protein ....."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Add the event listener here
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
        <div style={{ width: "200px" }}>
          <Select
            options={layoutOptions}
            onChange={handleLayoutChange}
            placeholder="Select Layout"
            maxMenuHeight={150}
            className="layout-dropdown"
          />
        </div>
      </div>
      <Select
        isMulti
        options={propertyOptions}
        onChange={handlePropertyChange}
        placeholder="Select the properties"
        maxMenuHeight={150}
        className="mb-4"
      />
      <div
        id="cy"
        style={{ width: "100%", height: "1600px" }}
      ></div>
    </div>
  );
};

export default NetworkGraph;
