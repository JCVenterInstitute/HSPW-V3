import "../D3GraphStyles.css";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3v7";
import { fetchDataFile } from "../../utils.js";

/**
 * Renders a density plot using D3.js.
 * The plot displays the density distribution of the numeric values in the provided data.
 *
 * @param {object} props - The component props.
 * @param {string} props.containerId - The ID for the container element.
 * @param {Array<object>} props.data - The data to be visualized.
 * @returns {JSX.Element} The rendered density plot component.
 */
const DensityPlot = ({ containerId, data }) => {
  const svgRef = useRef();
  const densityTooltip = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Extract numeric columns
    const numericColumns = Object.keys(data[0]).filter(
      (column) => column !== "" && column !== "Label" && column !== "Protein"
    );

    // Calculate the mean of each row
    const densityValues = data.map((d) => {
      const numericValues = numericColumns.map((column) =>
        parseFloat(d[column].replace(/"/g, ""))
      );
      const meanValue = d3.mean(numericValues);
      return meanValue;
    });

    // Set up dimensions and margins for density plot
    const densityMargin = { top: 20, right: 14, bottom: 60, left: 60 };
    const densityWidth = 500 - densityMargin.left - densityMargin.right;
    const densityHeight = 420 - densityMargin.top - densityMargin.bottom;

    const svgElement = d3.select(svgRef.current);

    // Clear previous plot if it exists
    svgElement.selectAll("*").remove();

    // Append group element to SVG
    const densitySvg = svgElement
      .attr(
        "viewBox",
        `0 0 ${densityWidth + densityMargin.left + densityMargin.right} ${
          densityHeight + densityMargin.top + densityMargin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMinYMin meet")
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
      .attr("stroke-width", 3)
      .attr("d", line);

    // Draw an invisible dummy line for easier hover interaction
    densitySvg
      .append("path")
      .datum(densityData)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 50) // Larger stroke width for easier hover
      .attr("d", line)
      .on("mouseover", () => {
        d3.selectAll(".point").style("opacity", 1);
        densityTooltip.current.transition().duration(200).style("opacity", 0.9);
      })
      .on("mouseout", () => {
        d3.selectAll(".point").style("opacity", 0);
        densityTooltip.current.transition().duration(500).style("opacity", 0);
      });

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
      .text("Mean Value");

    densitySvg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -densityHeight / 2)
      .attr("y", -densityMargin.left + 20)
      .text("Density");

    // Initialize tooltip once
    if (!densityTooltip.current) {
      densityTooltip.current = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip");
    }

    // Add mouseover and mouseout handlers for line and points
    densitySvg
      .selectAll(".point")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "orange").style("opacity", 1);
        densityTooltip.current.transition().duration(200).style("opacity", 0.9);
        densityTooltip.current
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
        densityTooltip.current.transition().duration(500).style("opacity", 0);
      });

    densitySvg.on("mousemove", function (event) {
      densityTooltip.current
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

    // Cleanup function
    return () => {
      svgElement.selectAll("*").remove();
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, containerId]);

  return (
    <div id={containerId} className="chart graph-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DensityPlot;
