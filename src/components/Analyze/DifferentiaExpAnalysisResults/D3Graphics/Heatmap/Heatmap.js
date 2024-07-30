import "../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchDataFile } from "../../utils";
import rowTsv from "./heat_row.tsv";
import colTsv from "./heat_col.tsv";
import localdata from "./data_normalized (4).csv";

const HeatmapComponent = ({ jobId, fileName, numbVolcanoSamples, tab }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [cleanedrowOrder, setCleanedrowOrder] = useState([]); // Add state for cleaned row order
  const [cleanedcolOrder, setCleanedcolOrder] = useState([]); // Add state for cleaned column order

  const margin = { top: 20, right: 30, bottom: 150, left: 135 };
  const width = 900 - margin.left - margin.right;
  const height = 850 - margin.top - margin.bottom;

  const cleanData = (data) => {
    if (!Array.isArray(data)) {
      console.error("Invalid data format:", data); // Log the invalid data format
      return []; // Return an empty array to prevent errors
    }
    return data.slice(1).map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replace(/^"|"$/g, ""); // Adjust regex to remove only leading and trailing quotes
      }
      return cleanedData;
    });
  };

  const chartRef = useRef(null),
    zoomRef = useRef(null);

  const cleanTsvData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((d) => +d.x).filter((value) => value); // Parse as number and filter out any undefined/null
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await d3.csv(localdata);
      console.log("result data:", result);
      const rowOrder = await d3.tsv(rowTsv);
      const colOrder = await d3.tsv(colTsv);

      let cleanedrowOrder = cleanTsvData(rowOrder);
      let cleanedcolOrder = cleanTsvData(colOrder);

      console.log("rowOrder", cleanedrowOrder);
      console.log("colOrder", cleanedcolOrder);
      let cleanedData = cleanData(result);
      if (tab.startsWith("Top")) {
        cleanedData = cleanedData.slice(0, numbVolcanoSamples);
      }

      setData(cleanedData);
      setCleanedrowOrder(cleanedrowOrder);
      setCleanedcolOrder(cleanedcolOrder);
    };

    loadData();
  }, [jobId, fileName, tab]);

  useEffect(() => {
    console.log(">numbVolcanoSamples", numbVolcanoSamples);
    console.log(">tab", tab);
    if (data.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const plot = svg
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract unique labels and columns
      const labels = data.map((d) => d[""]);
      const columns = Object.keys(data[0]).slice(1); // Ignore "Label"

      const colorScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain(d3.extent(data, (d) => +d[columns[0]]));
      console.log(
        "Color scale domain:",
        d3.extent(data, (d) => +d[columns[0]])
      );

      // const xScale = d3
      //   .scaleBand()
      //   .domain(columns)
      //   .range([0, width])
      //   .padding(0.05);
      // const yScale = d3
      //   .scaleBand()
      //   .domain(labels) // Set y-axis domain to cleaned row order
      //   .range([height, 0])
      //   .padding(0.05);
      const xScale = d3
        .scaleBand()
        .domain(cleanedcolOrder.map((index) => columns[index])) // Map indices to column names
        .range([0, width])
        .padding(0.05);

      console.log(">>>>>columns[3]:", columns[3]);

      const reversedcleanedrowOrder = [...cleanedrowOrder].reverse();

      const yScale = d3
        .scaleBand()
        .domain(reversedcleanedrowOrder.map((index) => labels[index])) // Map indices to protein names
        .range([height, 0])
        .padding(0.05);
      console.log(">>>>>labels[134]:", labels[134]);

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

      // Flatten the data to create a suitable structure for the heatmap
      const flattenedData = [];
      data.forEach((d) => {
        columns.forEach((column) => {
          flattenedData.push({
            Protein: d[""],
            Class: column,
            Value: d[column], // Access the value for each column
          });
        });
      });
      // Flatten the data to create a suitable structure for the heatmap
      // const flattenedData = [];
      // cleanedrowOrder.forEach((rowIndex) => {
      //   if (rowIndex >= 0 && rowIndex < data.length) {
      //     // Check if rowIndex is valid
      //     const protein = labels[rowIndex]; // Get the protein name using the index
      //     cleanedcolOrder.forEach((colIndex) => {
      //       if (colIndex >= 0 && colIndex < columns.length) {
      //         // Check if colIndex is valid
      //         const column = columns[colIndex]; // Get the column name using the index
      //         const value = data[rowIndex] ? data[rowIndex][column] : undefined; // Safe access
      //         if (value !== undefined) {
      //           flattenedData.push({
      //             Protein: protein,
      //             Class: column,
      //             Value: value,
      //           });
      //         } else {
      //           console.warn(
      //             `Value is undefined for Protein: ${protein}, Class: ${column}`
      //           );
      //         }
      //       }
      //     });
      //   } else {
      //     console.warn(`Invalid rowIndex: ${rowIndex}`);
      //   }
      // });

      // Create heatmap tiles
      plot
        .selectAll(".tile")
        .data(flattenedData) // Use the flattened data
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", (d) => xScale(d.Class)) // Set x based on the column name
        .attr("y", (d) => yScale(d.Protein)) // Set y based on the protein
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => {
          const value = +d.Value; // Use the value from the flattened data
          return colorScale(value); // Adjust to color each tile based on value
        })
        .on("mouseover", function (event, d) {
          const [x, y] = d3.pointer(event);
          d3.select("#tooltip")
            .style("display", "block")
            .style(
              "left",
              `${Math.min(window.innerWidth - 100, event.pageX + 10)}px`
            )
            .style(
              "top",
              `${Math.min(window.innerHeight - 100, event.pageY - 10)}px`
            )
            .html(
              `<strong>Protein:</strong> ${d.Protein}<br>` +
                `<strong>Class:</strong> ${d.Class}<br>` +
                `<strong>Value:</strong> ${d.Value}`
            );
        })
        .on("mouseout", function () {
          d3.select("#tooltip").style("display", "none");
        });

      // Append axes and labels (similar to your original code)
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

      plot.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 40})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Class");

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 30)
        .attr("x", -(height / 2))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Proteins");

      // Add legend
      const legendWidth = 300;
      const legendHeight = 10;
      const legend = plot
        .append("g")
        .attr(
          "transform",
          `translate(${(width - legendWidth) / 2}, ${
            height + margin.top + 110
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
          `translate(${width / 2}, ${height + margin.top + 150})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Legend");
    }
  }, [data]);

  return (
    <div className="heatmap-container">
      <svg
        ref={svgRef}
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      ></svg>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default HeatmapComponent;
