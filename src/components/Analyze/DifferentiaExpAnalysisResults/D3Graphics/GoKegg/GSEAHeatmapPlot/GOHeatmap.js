import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

/**
 * GOHeatmapComponent - A React component for rendering a heatmap using D3.js.
 *
 * This component generates a heatmap to visualize fold change values for proteins across different
 * descriptions. The heatmap is interactive with tooltips, a color gradient legend, and supports
 * toggling between "All Samples" and "Compressed graph" views. The component cleans the provided
 * data by removing extra double quotes and processes it to match proteins with fold change values.
 *
 * Props:
 * - `tableData` (Array of Objects): The data used for generating the heatmap, containing descriptions
 *   and core enrichment information. The first 25 rows are used for plotting.
 * - `allData` (Array of Objects): Additional data containing protein fold change values.
 *
 * State:
 * - `data1` (Array of Objects): Cleaned data from `tableData` for the heatmap.
 * - `data2` (Array of Objects): Cleaned data from `allData` used for fold change values.
 * - `activeTab` (String): The currently selected tab, which determines the view mode ("All Samples"
 *   or "Compressed graph").
 *
 * UseEffect Hooks:
 * - First `useEffect`: Cleans and updates `data1` and `data2` when `tableData` or `allData` props change.
 * - Second `useEffect`: Renders the heatmap using D3.js whenever `data1`, `data2`, or `activeTab`
 *   state changes. Includes setup for SVG elements, axes, grid lines, tiles, and tooltips.
 *
 * Methods:
 * - `cleanData(data)`: Cleans the data by removing leading and trailing double quotes from all fields.
 * - `drawBarChart(data)`: Handles the D3.js drawing operations including setting up scales, axes, grid lines,
 *   heatmap tiles, tooltips, and legend.
 * - `handleTabClick(tab)`: Updates the `activeTab` state when a tab is clicked.
 * - `wrap(text, width)`: Wraps text labels for y-axis to fit within specified width.
 *
 * @param {Object} props - The props object containing `tableData` and `allData`.
 * @returns {JSX.Element} - A `div` containing the heatmap SVG, tab buttons, and tooltip.
 */

const GOHeatmapComponent = ({ tableData, allData }) => {
  const svgRef = useRef();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [activeTab, setActiveTab] = useState("All Samples"); // State for active tab

  // Dimensions and margins for the SVG container
  const margin = { top: 20, right: 30, bottom: 150, left: 200 };
  const width = 900 - margin.left - margin.right;
  const height = 950 - margin.top - margin.bottom;

  // Function to clean data by removing quotes
  const cleanData = (data) => {
    return data.map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replace(/^"|"$/g, ""); // Adjust regex to remove only leading and trailing quotes
      }
      return cleanedData;
    });
  };

  // Effect hook to update data1 and data2 when props change
  useEffect(() => {
    try {
      setData1(cleanData(tableData.slice(0, 25))); //Slice the first 25 rows from Data1
      setData2(cleanData(allData));
    } catch (error) {
      console.error("Incorrect File:", error);
    }
  }, [tableData, allData]);

  useEffect(() => {
    if (data1.length > 0 && data2.length > 0) {
      const svg = d3.select(svgRef.current);

      // Clear any existing content
      svg.selectAll("*").remove();

      // Set viewBox and preserveAspectRatio
      svg
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .attr("preserveAspectRatio", "xMinYMin meet");

      // Create the plot group
      const plot = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      const proteins = Array.from(new Set(data2.map((d) => d["Protein"])));
      const Descriptions = Array.from(
        new Set(data1.map((d) => d["Description"]))
      ); // Get unique descriptions

      // Create a mapping of proteins to fold change values
      const proteinFoldChange = {};
      data2.forEach((d) => {
        const protein = d["Protein"];
        const foldChange = parseFloat(d["Fold.Change"]);
        proteinFoldChange[protein] = foldChange;
      });

      // Prepare heatmap data
      const heatmapData = data1.flatMap((d) => {
        const proteins = d["core_enrichment"].split("/");
        return proteins.map((protein) => {
          const rawFC = proteinFoldChange[protein] || 0;
          const log2FC = Math.sign(rawFC) * Math.log2(Math.abs(rawFC) || 1e-6);
          return {
            ...d,
            Protein: protein,
            "Fold.Change": log2FC,
          };
        });
      });

      // Filter valid data points
      const validData = heatmapData.filter((d) => !isNaN(d["Fold.Change"]));

      let filteredProteins = proteins;

      let finalValidData = validData;

      // Apply filter based on the active tab
      if (activeTab === "Compressed graph") {
        filteredProteins = new Set(
          validData.filter((d) => d["Protein"]).map((d) => d["Protein"])
        );
        finalValidData = validData.filter((d) =>
          filteredProteins.has(d["Protein"])
        );
      }

      // Define color scale for heatmap
      // const colorScale = d3
      //   .scaleSequential(d3.interpolateRdBu)
      //   .domain(d3.extent(data2, (d) => +d["Fold.Change"]));

      //Constant Color Scale
      // const colorScale = d3
      //   .scaleSequential(d3.interpolateRdBu)
      //   .domain([5, -5]); // Adjust range if needed based on your data

      //Dynamic Color Scale
      const log2FCs = validData.map((d) => d["Fold.Change"]);
      const colorScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain([d3.max(log2FCs), d3.min(log2FCs)]); // Inverted for RdBu

      // Define x and y axis
      const xScale = d3
        .scaleBand()
        .domain(Array.from(filteredProteins))
        .range([0, width])
        .padding(0.05);

      const yScale = d3
        .scaleBand()
        .domain(Descriptions)
        .range([height, 0])
        .padding(0.05);

      // Append grid lines
      plot
        .append("g")
        .attr("class", "grid")
        .selectAll("line")
        .data(xScale.domain())
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(d))
        .attr("x2", (d) => xScale(d))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#e0e0e0");

      plot
        .append("g")
        .attr("class", "grid")
        .selectAll("line")
        .data(yScale.domain())
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))
        .attr("stroke", "#e0e0e0");

      // Append heatmap tiles (rectangles)
      plot
        .selectAll(".tile")
        .data(finalValidData)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", (d) => xScale(d["Protein"]))
        .attr("y", (d) => yScale(d["Description"]))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(d["Fold.Change"]))
        .on("mouseover", function (event, d) {
          const [x, y] = d3.pointer(event);
          d3.select("#tooltip")
            .style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(
              `<strong>Protein:</strong> ${d["Protein"]}<br>` +
                `<strong>Description:</strong> ${
                  d["Description"] || "N/A"
                }<br>` +
                `<strong>log2FC:</strong> ${d["Fold.Change"]}`
            );
        })
        .on("mouseout", function () {
          d3.select("#tooltip").style("display", "none");
        });

      plot
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll(".tick text")
        .attr("transform", "rotate(-90)")
        .attr("x", -5)
        .attr("dy", "0.32em")
        .style("text-anchor", "end");

      plot
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll(".tick text")
        .attr("x", -5)
        .style("text-anchor", "end")
        .call(wrap, margin.left - 10)
        .attr("transform", "translate(-10, 0)");

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 40})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Protein");

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -(height / 2))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Description");

      //Add legend
      const legendWidth = 300;
      const legendHeight = 10;

      const legend = plot
        .append("g")
        .attr(
          "transform",
          `translate(${(width - legendWidth) / 2}, ${
            height + margin.top + 100
          })`
        );

      const legendScale = d3
        .scaleLinear()
        .domain(colorScale.domain())
        .range([0, legendWidth]);

      const legendAxis = d3
        .axisBottom(legendScale)
        .ticks(5)
        .tickSize(-legendHeight);

      legend
        .selectAll("rect")
        .data(colorScale.ticks(legendWidth))
        .enter()
        .append("rect")
        .attr("x", (d) => legendScale(d))
        .attr("y", 0)
        .attr("width", legendWidth / colorScale.ticks(legendWidth).length)
        .attr("height", legendHeight)
        .attr("fill", (d) => colorScale(d));

      legend
        .append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("stroke", "#d0d0d0")
            .attr("stroke-dasharray", "2,2")
        );

      plot
        .append("g")
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 90})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("log2FC");
    }
  }, [data1, data2, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to wrap text for y axis labels
  function wrap(text, width) {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", `${dy}em`);
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", `${++lineNumber * lineHeight + dy}em`)
            .text(word);
        }
      }
    });
  }

  return (
    <div className="heatmap-container">
      <div className="tabs">
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          sx={{
            backgroundColor: "#EBEBEB",
            borderRadius: "16px",
            "& .MuiToggleButtonGroup-grouped": {
              margin: "7px 5px",
              border: "none",
              padding: "5px 10px",
              fontFamily: "Montserrat",
              borderRadius: "16px !important",
              "&.Mui-selected": {
                backgroundColor: "#1463B9",
                color: "white",
                "&:hover": {
                  backgroundColor: "#6B9AC4",
                },
              },
              "&:not(.Mui-selected)": {
                color: "#1463B9",
                "&:hover": {
                  backgroundColor: "#BBD1E9",
                },
              },
            },
          }}
        >
          <ToggleButton
            value="All Samples"
            onClick={() => handleTabClick("All Samples")}
          >
            All Samples
          </ToggleButton>
          <ToggleButton
            value="Compressed graph"
            onClick={() => handleTabClick("Compressed graph")}
          >
            Compressed graph
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <svg ref={svgRef}></svg>
      <div
        id="tooltip"
        className="tooltip"
      ></div>
    </div>
  );
};

export default GOHeatmapComponent;
