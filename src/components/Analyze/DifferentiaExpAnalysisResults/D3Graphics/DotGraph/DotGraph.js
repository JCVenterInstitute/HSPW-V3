// import "../D3GraphStyles.css";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchDataFile } from "../../utils.js";
import styles from "./DotGraph.module.css";

const DotGraph = ({ plotData }) => {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = plotData.map((d) => ({
          type: d.Protein.replace(/"/g, ""),
          mean_degrees_accuracy: +d.MeanDecreaseAccuracy,
        }));

        const topData = jsonData
          .sort((a, b) => b.mean_degrees_accuracy - a.mean_degrees_accuracy)
          .slice(0, 15);
        setData(topData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [plotData]);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(ref.current).attr("width", 800);
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = data.length * 30 + margin.top + margin.bottom;

    svg.attr("height", height + margin.top + margin.bottom);

    const x = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.mean_degrees_accuracy),
        d3.max(data, (d) => d.mean_degrees_accuracy),
      ])
      .range([margin.left, width + margin.left]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.type))
      .range([margin.top, height])
      .padding(0.1);

    d3.select("body").selectAll(".tooltip").remove();

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.mean_degrees_accuracy))
      .attr("cy", (d) => y(d.type) + y.bandwidth() / 2)
      .attr("r", 5)
      .attr("class", "circle")
      .on("mouseover", function (d) {
        const event = d3.event;
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Type: ${d.type || "N/A"}<br/>Accuracy: ${
              d.mean_degrees_accuracy || "N/A"
            }`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mousemove", function () {
        const event = d3.event;
        tooltip
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "axis")
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .selectAll("line")
      .data(data)
      .join("line")
      .attr("x1", margin.left)
      .attr("x2", width + margin.left)
      .attr("y1", (d) => y(d.type) + y.bandwidth() / 2)
      .attr("y2", (d) => y(d.type) + y.bandwidth() / 2)
      .attr("class", "line");

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width + margin.left)
      .attr("y1", margin.top)
      .attr("y2", margin.top)
      .attr("class", "border-line");

    svg
      .append("line")
      .attr("x1", width + margin.left)
      .attr("x2", width + margin.left)
      .attr("y1", margin.top)
      .attr("y2", height)
      .attr("class", "border-line");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", (width + margin.left) / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Mean Decrease Accuracy");

    return () => tooltip.remove();
  }, [data]);

  return (
    <div className="graph-container">
      <svg ref={ref}></svg>
    </div>
  );
};

export default DotGraph;
