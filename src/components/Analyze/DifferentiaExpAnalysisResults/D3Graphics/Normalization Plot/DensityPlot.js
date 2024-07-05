import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3v7";
import "./norm-style.css";
import { fetchCSV } from "../../utils.js"; // Import fetchCSV from utils.js

const DensityPlot = ({ containerId, jobId, datafile }) => {
  const svgRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await fetchCSV(jobId, datafile);
        // console.log("Fetched CSV Data:", csvData); // Log fetched CSV data
        setData(csvData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jobId, datafile]);

  useEffect(() => {
    if (!data) return;
    console.log("> Denisty plot id:", containerId);
    console.log("> Denisty plot data:", data);

    // Extract numeric columns for density plot
    const numericColumns = Object.keys(data[0]).filter(
      (column) => column !== "" && column !== "Label" && column !== "Protein"
    );
    //console.log("numericColumns", numericColumns);

    // Extract the first numeric column for density plot (e.g., "HSPP_DW_2155.97")
    const columnKey = numericColumns[0];
    //console.log("columnKey", columnKey);

    // Prepare data for density plot
    const densityValues = data.map((d) =>
      parseFloat(d[columnKey].replace(/"/g, ""))
    );
    //console.log("densityValues", densityValues);

    // Set up dimensions and margins for density plot
    const densityMargin = { top: 20, right: 14, bottom: 60, left: 70 };
    const densityWidth = 500 - densityMargin.left - densityMargin.right;
    const densityHeight = 420 - densityMargin.top - densityMargin.bottom;

    const svgElement = d3.select(svgRef.current);

    // Clear previous plot if it exists
    svgElement.selectAll("*").remove();

    // Append group element to SVG
    const densitySvg = svgElement
      .attr("width", densityWidth + densityMargin.left + densityMargin.right)
      .attr("height", densityHeight + densityMargin.top + densityMargin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${densityMargin.left}, ${densityMargin.top})`
      );

    // Set up initial scales for density plot
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(densityValues))
      .nice()
      .range([0, densityWidth]);

    const kde = kernelDensityEstimator(
      epanechnikovKernel(0.5),
      xScale.ticks(100)
    );
    const densityData = kde(densityValues);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(densityData, (d) => d[1])])
      .nice()
      .range([densityHeight, 0]);

    // Create line generator for density plot
    const line = d3
      .line()
      .curve(d3.curveBasis)
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    // Draw initial density plot line
    densitySvg
      .append("path")
      .datum(densityData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add points to the line
    densitySvg
      .selectAll(".point")
      .data(densityData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 3)
      .attr("fill", "steelblue")
      .style("opacity", 0);

    // Add x axis
    densitySvg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${densityHeight})`)
      .call(d3.axisBottom(xScale));

    // Add y axis
    densitySvg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // Axis labels
    densitySvg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", densityWidth / 2)
      .attr("y", densityHeight + densityMargin.bottom - 20)
      .text("Value");

    densitySvg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -densityHeight / 2)
      .attr("y", -densityMargin.left + 20)
      .text("Density");

    // Add tooltip div for density plot
    const densityTooltip = d3
      .select("body")
      .append("div")
      .attr("class", "normtooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "5px");

    // Add mouseover and mouseout handlers for line and points
    densitySvg
      .selectAll(".point")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "orange").style("opacity", 1);
        densityTooltip.transition().duration(200).style("opacity", 0.9);
        densityTooltip
          .html(
            `<strong>Value:</strong> ${d[0].toFixed(
              2
            )} <br> <strong>Density:</strong> ${d[1].toFixed(2)}`
          )
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "steelblue").style("opacity", 0);
        densityTooltip.transition().duration(500).style("opacity", 0);
      });

    densitySvg.on("mousemove", function (event) {
      densityTooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 28}px`);
    });

    // Kernel density estimator function
    function kernelDensityEstimator(kernel, x) {
      return function (sample) {
        return x.map(function (x) {
          return [
            x,
            d3.mean(sample, function (v) {
              return kernel(x - v);
            }),
          ];
        });
      };
    }

    // Epanechnikov kernel function
    function epanechnikovKernel(scale) {
      return function (u) {
        return Math.abs((u /= scale)) <= 1 ? (0.75 * (1 - u * u)) / scale : 0;
      };
    }

    //console.log(`Creating density plot in ${containerId} with data:`, data);

    // Cleanup function
    return () => {
      // Clean up any D3 elements if necessary
      svgElement.selectAll("*").remove();
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, containerId]);

  return (
    <div id={containerId} className="chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DensityPlot;
