import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchTSV } from "../../../utils";

const BarChartComponent = ({ jobId, datafile, selectedSection }) => {
  const [data, setData] = useState(null);
  const svgRef = useRef();

  const margin = { top: 20, right: 10, bottom: 50, left: 280 };
  const width = 1200 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tsvData } = await fetchTSV(
          jobId,
          datafile,
          selectedSection
        );
        setData(tsvData.slice(0, 20)); // Take the first 20 rows for plotting
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jobId, datafile, selectedSection]);

  useEffect(() => {
    if (data) {
      drawBarChart(data);
    }
  }, [data]);

  const drawBarChart = (data) => {
    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
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

    // Y scale (for bars)
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.GeneRatio))
      .range([0, height])
      .padding(0.2); // Increase the gap between bars

    // X scale (for counts)
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d["Unnamed Column"]) + 5])
      .nice()
      .range([0, width]);

    // Y axis with grid lines
    svg
      .append("g")
      .attr("class", "axis y-axis")
      .call(d3.axisLeft(y))
      .selectAll(".tick line")
      .attr("x2", width)
      .attr("stroke-opacity", 0.1);

    // X axis with label and grid lines
    svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height))
      .selectAll(".tick line")
      .attr("stroke-opacity", 0.1); // Fade x-axis grid lines

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Count");

    // Define color scale based on p.adjust values
    const colorScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => +d["p.adjust"]))
      .range(["red", "blue"]);

    // Tooltip
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    function handleMouseOver(event, d) {
      d3.select(this).attr("fill-opacity", 0.5);
      tooltip.html(
        `<strong>GeneRatio:</strong> ${d.GeneRatio}<br/>
        <strong>ID:</strong> ${d.ID}<br/>
        <strong>Description:</strong> ${d.Description}<br/>
        <strong>BgRatio:</strong> ${d.BgRatio}<br/>
        <strong>Count:</strong> ${d["Unnamed Column"]}<br/>
        <strong>p-value:</strong> ${d.pvalue}<br/>
        <strong>p-adjust:</strong> ${d["p.adjust"]}<br/>
        <strong>q-value:</strong> ${d.qvalue}<br/>
        <strong>geneID:</strong> ${d.geneID}`
      );
      tooltip.style("visibility", "visible");
    }

    function handleMouseMove(event) {
      tooltip
        .style("top", event.pageY + 10 + "px")
        .style("left", event.pageX + 10 + "px");
    }

    function handleMouseOut() {
      d3.select(this).attr("fill-opacity", 1);
      tooltip.style("visibility", "hidden");
    }

    // Bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.GeneRatio))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", (d) => x(+d["Unnamed Column"]))
      .attr("fill", (d) => colorScale(+d["p.adjust"]))
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    // Bar labels
    svg
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("y", (d) => y(d.GeneRatio) + y.bandwidth() / 2)
      .attr("x", (d) => x(+d["Unnamed Column"]) + 5)
      .text((d) => d["Unnamed Column"])
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle");

    // Legend
    const legendHeight = 150;
    const legendWidth = 18;

    const legend = svg
      .append("g")
      .attr("id", "barChartLegend")
      .attr(
        "transform",
        `translate(${width - 70},${height - legendHeight - 30})`
      );

    const defs = legend.append("defs");

    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "red");

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "blue");

    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#linear-gradient)");

    // Add text labels to the legend
    legend
      .append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -5) // Adjust the y position for the text
      .attr("text-anchor", "middle")
      .text("p.adjust")
      .style("font-size", "12px")
      .style("fill", "#333"); // Adjust font size and color as needed

    const legendScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => +d["p.adjust"]))
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale).ticks(5);

    legend
      .append("g")
      .attr("class", "axis legend-axis")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis);
  };

  return (
    <div className="barchart-container">
      <div id="barChart" className="barchart" ref={svgRef}></div>
    </div>
  );
};

export default BarChartComponent;
