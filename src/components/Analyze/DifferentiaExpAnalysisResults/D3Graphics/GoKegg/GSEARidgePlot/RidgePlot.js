import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchTSV, fetchCSV } from "../../../utils";

const RidgePlotComponent = ({
  jobId,
  fileName1,
  fileName2,
  selectedSection,
}) => {
  const svgRef = useRef();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const margin = { top: 20, right: 30, bottom: 40, left: 100 };
  const width = 900 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  useEffect(() => {
    const loadData = async () => {
      const result1 = await fetchTSV(jobId, fileName1, selectedSection);
      const result2 = await fetchCSV(jobId, fileName2, selectedSection);

      setData1(result1.data.slice(0, 25)); // Select first 25 rows from Data1
      setData2(result2.data);
    };

    loadData();
  }, [jobId, fileName1, fileName2, selectedSection]);

  useEffect(() => {
    if (data1.length > 0 && data2.length > 0) {
      const svg = d3.select(svgRef.current);

      // Remove any existing SVG content before drawing the new plot
      svg.selectAll("*").remove();

      // Append the svg object to the body of the page
      const plot = svg
        .append("svg")
        .attr("class", "chart")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .attr("width", "100%")
        .attr("height", "auto")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract unique `setSize` values from Data1
      const setSizeValues = Array.from(new Set(data1.map((d) => d.setSize)));

      // X scale for Fold.Change
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data2, (d) => +d["Fold.Change"])) // Assuming Fold.Change is numeric
        .range([0, width]);

      // Y scale for setSize
      const yScale = d3
        .scaleBand()
        .domain(setSizeValues)
        .range([height, 0])
        .padding(0.1);

      // Color scale for density lines
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, 100]);

      // Kernel density estimation function
      const kde = (kernel, thresholds, data) => {
        return thresholds.map((t) => [
          t,
          d3.mean(data, (d) => kernel(t - +d["Fold.Change"])),
        ]);
      };

      // Epanechnikov kernel function
      const kernelEpanechnikov = (k) => (v) =>
        Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

      // Process each setSize group
      setSizeValues.forEach((setSize) => {
        // Filter Data1 for the current setSize
        const groupData1 = data1.filter((d) => d.setSize === setSize);

        // Find matching rows in Data2 based on Unnamed Column and Protein
        const matchedData2 = data2.filter((d2) =>
          groupData1.some(
            (d1) =>
              d1["Unnamed Column"].replace(/['"]+/g, "") ===
              d2.Protein.replace(/['"]+/g, "")
          )
        );

        const density = kde(
          kernelEpanechnikov(7),
          xScale.ticks(40),
          matchedData2
        );

        plot
          .append("path")
          .datum(density)
          .attr("fill", "none")
          .attr("stroke", colorScale(density[0][0]))
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .line()
              .curve(d3.curveBasis)
              .x((d) => xScale(d[0]))
              .y((d) => yScale(setSize) + yScale.bandwidth() / 2 - d[1] * 50)
          ); // Adjust scaling factor as necessary
      });

      // Append x-axis
      plot
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      // Append y-axis
      plot.append("g").call(d3.axisLeft(yScale));
    }
  }, [data1, data2]);

  return (
    <div className="ridgechart-container">
      <svg id="ridgeChart" className="ridgechart" ref={svgRef}></svg>
    </div>
  );
};

export default RidgePlotComponent;
