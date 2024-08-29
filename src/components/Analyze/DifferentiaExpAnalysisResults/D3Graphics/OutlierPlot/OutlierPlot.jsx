import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const OutlierPlot = ({ outlierData, groupMapping }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Combine outlierData and groupMapping into a single array
    const combinedData = outlierData.map((d) => ({
      sample: d.Sample, // Make sure to use 'sample' to match the expected structure
      value: d.x, // Use 'value' for clarity instead of 'x'
      group: groupMapping[d.Sample],
    }));

    // Set the dimensions and margins of the graph
    const margin = { top: 75, right: 150, bottom: 20, left: 60 }; // Increased top margin to prevent label cutoff
    const width = dimensions.width - margin.left - margin.right - 20;
    const height = dimensions.height - margin.top - margin.bottom - 100;

    // Clear the SVG content before drawing
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(combinedData.map((d) => d.sample))
      .range([0, width])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(combinedData, (d) => d.value) - 1,
        d3.max(combinedData, (d) => d.value) + 1,
      ])
      .range([height, 0]);

    // Create y-axis only
    svg.append("g").call(d3.axisLeft(yScale));

    // Color scale for groups
    const color = d3.scaleOrdinal().domain(["A", "B"]).range(["red", "green"]);

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #d3d3d3")
      .style("padding", "5px")
      .style("visibility", "hidden")
      .style("z-index", 10); // Ensure tooltip is above other elements

    // Draw the lines with tooltips
    svg
      .selectAll(".line")
      .data(combinedData)
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d.sample) + xScale.bandwidth() / 2)
      .attr("x2", (d) => xScale(d.sample) + xScale.bandwidth() / 2)
      .attr("y1", yScale(0))
      .attr("y2", (d) => yScale(d.value))
      .attr("stroke", (d) => color(d.group))
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        tooltip
          .html(`Sample: ${d.sample}<br>Value: ${d.value}<br>Group: ${d.group}`)
          .style("visibility", "visible");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 25 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Sort data to find the five longest lines
    const longestLines = combinedData
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 5);

    // Add labels to the five longest lines
    svg
      .selectAll(".label")
      .data(longestLines)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.sample) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.value))
      .attr("dy", (d) => (d.value > 0 ? -15 : 15)) // Adjust dy for label positioning
      .attr("text-anchor", "middle")
      .attr("transform", (d) => {
        return `rotate(-90 ${
          xScale(d.sample) + xScale.bandwidth() / 2
        },${yScale(d.value)})`; // Rotate label for vertical text
      })
      .text((d) => d.sample)
      .style("font-size", "12px");

    // Add legend with labels
    const legend = svg
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .attr("class", "legend");

    legend
      .append("rect")
      .attr("x", width + 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", width + 45)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => `${d}`);
  }, [outlierData, groupMapping, dimensions]);

  return <svg ref={svgRef} style={{ width: "90%", height: "100%" }} />;
};

export default OutlierPlot;
