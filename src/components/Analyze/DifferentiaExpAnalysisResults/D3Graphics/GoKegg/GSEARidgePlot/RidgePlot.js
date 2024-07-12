import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchTSV } from "../../../utils";

const RidgePlotComponent = ({ jobId, fileName, selectedSection }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchTSV(jobId, fileName, selectedSection);
      setData(result.data);
    };

    loadData();
  }, [jobId, fileName, selectedSection]);

  useEffect(() => {
    console.log(">Ridge Data:", data);
    if (data.length === 0) return;

    // Remove any existing SVG content before drawing the new plot
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process the data
    const groups = Array.from(new Set(data.map((d) => d["Group"]))),
      x = d3.scaleLinear().domain([0, 100]).range([0, width]), // Adjust domain as necessary
      y = d3.scaleBand().domain(groups).range([height, 0]).padding(0.1),
      color = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

    svg.append("g").call(d3.axisLeft(y));
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const kde = (kernel, thresholds, data) => {
      return thresholds.map((t) => [t, d3.mean(data, (d) => kernel(t - d))]);
    };

    const kernelEpanechnikov = (k) => (v) =>
      Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

    // For each group
    groups.forEach((group) => {
      const groupData = data
        .filter((d) => d["Group"] === group)
        .map((d) => +d["Value"]); // Adjust field names as necessary
      const density = kde(kernelEpanechnikov(7), x.ticks(40), groupData);

      svg
        .append("path")
        .datum(density)
        .attr("fill", "none")
        .attr("stroke", color(x(density[0][0])))
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveBasis)
            .x((d) => x(d[0]))
            .y((d) => y(group) + y.bandwidth() / 2 - d[1] * 50)
        ); // Adjust scaling factor as necessary
    });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default RidgePlotComponent;
