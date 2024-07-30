import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchDataFile } from "../../../utils";
import localData from "./gsecc_tree.tsv";

const TreeClusterPlotComponent = ({
  jobId,
  fileName1,
  selectedSection,
  plotData,
}) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 900 - margin.left - margin.right;
  const height = 900 - margin.top - margin.bottom;

  const cleanData = (data) => {
    console.log("Cleaning data...");
    return data.map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key] ? d[key].replace(/^"|"$/g, "") : "";
      }
      return cleanedData;
    });
  };

  const loadLocalData = () => {
    console.log("Loading local data...");
    d3.tsv(localData)
      .then((parsedData) => {
        console.log("Loaded Local Data:", parsedData);
        setData(cleanData(parsedData));
      })
      .catch((error) => {
        console.error("Error loading local data:", error);
      });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // console.log("Loading data from server...");
        // const result = await fetchDataFile(jobId, fileName1, selectedSection);
        // console.log("Raw Data from Server:", result.data);
        setData(cleanData(plotData));
      } catch (error) {
        console.error("Error fetching remote data:", error);
        loadLocalData(); // Fallback to local data if fetchDataFile fails
      }
    };
    loadData();
  }, [plotData]);

  useEffect(() => {
    if (data.length > 0) {
      console.log("Data is available for processing:", data);

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      console.log("SVG container selected and cleared.");

      const tree = d3.tree().size([height, width]);
      const root = createHierarchy(data);
      tree(root);
      console.log("Tree layout created with root:", root);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      console.log("Color scale created.");

      svg
        .selectAll(".link")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.source.y)
        .attr("y1", (d) => d.source.x)
        .attr("x2", (d) => d.target.y)
        .attr("y2", (d) => d.target.x)
        .attr("stroke", "#999")
        .attr("stroke-width", "2px");
      console.log("Tree links rendered.");

      svg
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", (d) => d.y)
        .attr("cy", (d) => d.x)
        .attr("r", 5)
        .style("fill", (d) => colorScale(d.data.color || "default"));
      console.log("Tree nodes rendered.");

      svg
        .selectAll(".label")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => d.y + 10)
        .attr("y", (d) => d.x + 5)
        .text((d) => d.data.label || "")
        .style("font-size", "12px");
      console.log("Node labels rendered.");
    }
  }, [data]);

  const createHierarchy = (data) => {
    console.log("Creating hierarchy from data...");
    const nodes = {};
    const root = { name: "root", children: [] };

    data.forEach((d) => {
      nodes[d.node] = {
        name: d.node,
        label: d.label,
        color: d.color,
        parent: d.parent,
        children: [],
      };
    });

    Object.keys(nodes).forEach((key) => {
      const node = nodes[key];
      if (node.parent) {
        if (!nodes[node.parent]) {
          console.error(
            `Parent node ${node.parent} not found for node ${node.name}`
          );
          return;
        }
        nodes[node.parent].children.push(node);
      } else {
        root.children.push(node);
      }
    });

    console.log("Hierarchy created:", root);
    return d3.hierarchy(root);
  };

  return (
    <div className="tree-cluster-plot-container">
      <svg
        ref={svgRef}
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      ></svg>
    </div>
  );
};

export default TreeClusterPlotComponent;
