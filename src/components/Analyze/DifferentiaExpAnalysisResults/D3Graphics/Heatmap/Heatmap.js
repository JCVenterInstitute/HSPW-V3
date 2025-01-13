import "../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";

/**
 * HeatmapComponent renders a heatmap visualization using D3.js within a React component.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.jobId - The job ID for data fetching.
 * @param {string} props.fileName - The file name for the data to be loaded.
 * @param {number} props.numbVolcanoSamples - The number of volcano samples to display.
 * @param {string} props.tab - The current tab to determine which data to load.
 *
 * @returns {JSX.Element} - The rendered React component.
 */
const HeatmapComponent = ({ jobId, fileName, numbVolcanoSamples, tab }) => {
  const svgRef = useRef();
  const resetButtonRef = useRef(null);
  const zoomRef = useRef();
  const [data, setData] = useState([]);

  const margin = { top: 20, right: 30, bottom: 200, left: 135 };
  const width = 1000 - margin.left - margin.right;
  const height = 1050 - margin.top - margin.bottom;

  // Function to clean data by removing quotes
  const cleanData = (data) => {
    return data.slice(1).map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replace(/^"|"$/g, "");
      }
      return cleanedData;
    });
  };

  useEffect(() => {
    // Function to load and clean data based on the current tab
    const loadData = async () => {
      let cleanedData = cleanData(fileName);
      if (tab.startsWith("Top")) {
        cleanedData = cleanedData.slice(0, numbVolcanoSamples);
      }
      setData(cleanedData);
    };

    loadData();
  }, [jobId, fileName, tab]); // Re-load data when dependencies change

  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Set up the SVG with viewBox and preserveAspectRatio
      svg
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        );

      const plot = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract unique labels and columns
      const labels = data.map((d) => d["Protein"]);
      const columns = Object.keys(data[0]).slice(1);

      const colorScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain(d3.extent(data, (d) => +d[columns[0]]));

      const xScale = d3
        .scaleBand()
        .domain(columns)
        .range([0, width])
        .padding(0.05);
      const reversedlabels = [...labels].reverse();
      const yScale = d3
        .scaleBand()
        .domain(reversedlabels)
        .range([height, 0])
        .padding(0.1);

      // Add zoom functionality and apply it to the SVG
      const zoomed = (event) => {
        const { transform } = event;
        plot.attr("transform", transform);
        plot.attr("stroke-width", 1 / transform.k);
      };

      const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

      svg.call(zoom);
      zoomRef.current = zoom;

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
            Protein: d.Protein,
            Class: column,
            Value: d[column],
          });
        });
      });

      // Create heatmap tiles
      plot
        .selectAll(".tile")
        .data(flattenedData)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", (d) => xScale(d.Class))
        .attr("y", (d) => yScale(d.Protein))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(+d.Value))
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

      // Append axes and labels
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
          `translate(${width / 2}, ${height + margin.top + 110})`
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
            height + margin.top + 125
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
          `translate(${width / 2}, ${height + margin.top + 165})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Legend");

      // Reset zoom when the tab changes
      if (resetButtonRef.current) {
        resetButtonRef.current.addEventListener("click", () => {
          svg
            .transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity)
            .on("end", () => {
              plot.attr("transform", `translate(${margin.left},${margin.top})`);
            });
        });
      }
    }
  }, [data, tab]);

  return (
    <div className="heatmap-container graph-container">
      <button ref={resetButtonRef} className="heatmap-reset-button">
        Reset Zoom
      </button>
      <svg ref={svgRef} style={{ width: "100%", height: "auto" }}></svg>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default HeatmapComponent;
