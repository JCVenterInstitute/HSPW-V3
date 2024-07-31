import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";

const TreeClusterPlotComponent = ({ plotData }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 900 - margin.left - margin.right;
  const height = 900 - margin.top - margin.bottom;

  const cleanData = (data) => {
    return data.map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key] ? d[key].replace(/^"|"$/g, "") : "";
      }
      return cleanedData;
    });
  };

  useEffect(() => {
    const loadData = () => {
      try {
        setData(cleanData(plotData));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [plotData]);

  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const tree = d3.tree().size([height, width]);
      const root = createHierarchy(data);
      tree(root);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
    }
  }, [data]);

  const createHierarchy = (data) => {
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
