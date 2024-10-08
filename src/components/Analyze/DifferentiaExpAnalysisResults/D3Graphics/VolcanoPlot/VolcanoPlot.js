import React, { useEffect, useRef } from "react";
import { createLegend } from "../../utils";
import "../D3GraphStyles.css";
import * as d3 from "d3v7";

const VolcanoPlot = ({
  data = null,
  foldChange = 2,
  pval = 0.05,
  xCol = 3,
  yCol = 4,
  details = [],
  xlabel = "",
  ylabel = "",
}) => {
  pval = -Math.log10(pval);
  foldChange = Math.log2(foldChange);

  const chartRef = useRef(null),
    svgRef = useRef(null),
    zoomRef = useRef(null);

  const margin = { top: 20, right: 20, bottom: 60, left: 80 };

  useEffect(() => {
    if (data === null) {
      return () => {
        d3.select(chartRef.current).selectAll("*").remove();
        d3.select(chartRef.current)
          .selectAll("div#zoom-slider-container")
          .remove();
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    const SVGwidth = 1600;
    const SVGheight = 800;
    const innerWidth = SVGwidth - margin.left - margin.right;
    const innerHeight = SVGheight - margin.top - margin.bottom;

    const parentContainer = d3.select(chartRef.current);

    // Creating the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${SVGwidth} ${SVGheight}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgRef.current = svg;

    svg.node().addEventListener("wheel", (event) => event.preventDefault());

    // Append slider for zoom control
    const slider = parentContainer
      .append("div")
      .attr("id", "zoom-slider-container")
      .append("input")
      .attr("type", "range")
      .attr("id", "zoom-slider")
      .attr("class", "sleek-slider")
      .attr("min", "1")
      .attr("max", "20")
      .attr("step", "0.1")
      .attr("value", "1")
      .style("width", "50%");
    document.getElementById("zoom-slider").disabled = true;

    // Defining the clip path to restrict drawing within the chart area
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    // Instantiating the tooltip
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    // Loading and parsing given data
    var datakeys = Object.keys(data[0]),
      xValKey = datakeys[xCol],
      yValKey = datakeys[yCol];

    // Determine the dynamic scales based on the data
    const xExtent = d3.extent(data, (d) => d[xValKey] * 1.1);
    const yExtent = d3.extent(data, (d) => d[yValKey] * 1.25);

    const xScale = d3
      .scaleLinear()
      .range([0, innerWidth])
      .domain([-0.1 * xExtent[1] + xExtent[0], xExtent[1]]);

    const yScale = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([-0.1 * yExtent[1] + yExtent[0], yExtent[1]]);

    // Instantiating x and y axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Setting up x axis
    const gX = svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // Labeling x axis
    gX.append("text")
      .attr("class", "label")
      .attr("transform", `translate(${innerWidth / 2},${margin.bottom - 4})`)
      .attr("text-anchor", "middle")
      .text(xlabel === "" ? xValKey : xlabel);

    // Setting up y axis
    const gY = svg.append("g").attr("class", "y axis").call(yAxis);

    // Labeling y axis
    gY.append("text")
      .attr("class", "label")
      .attr(
        "transform",
        `translate(${-margin.left / 1.5},${innerHeight / 2}) rotate(-90)`
      )
      .attr("text-anchor", "middle")
      .text(ylabel === "" ? yValKey : ylabel);

    // Instantiate gridlines
    var gridLines = svg.append("g").attr("class", "grid");

    // Setup horizontal grid lines
    gridLines
      .append("g")
      .attr("class", "x grid")
      .attr("transform", "translate(0," + innerHeight + ")")
      .call(
        d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight).tickFormat("")
      );

    // Setup vertical grid lines
    gridLines
      .append("g")
      .attr("class", "y grid")
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-innerWidth).tickFormat(""));

    // Creates a rectangle that allows zooming to be done anywhere on the chart
    svg
      .append("rect")
      .attr("class", "zoom")
      .attr("height", innerHeight)
      .attr("width", innerWidth);

    // Instantiates thresholds separating circles by class
    const thresholdLines = svg.append("g").attr("class", "thresholdLines");

    // add horizontal lines at y= pval
    [pval, 0].forEach(function (threshold) {
      thresholdLines
        .append("svg:line")
        .attr("class", threshold === 0 ? "threshold bold" : "threshold")
        .attr("x1", -innerWidth)
        .attr("x2", innerWidth * 2)
        .attr("y1", yScale(threshold))
        .attr("y2", yScale(threshold))
        .attr("stroke-dasharray", threshold === 0 ? "none" : "5, 5");
    });

    // add vertical lines at x = -foldChange, foldChange
    [-foldChange, foldChange, 0].forEach(function (threshold) {
      thresholdLines
        .append("svg:line")
        .attr("class", threshold === 0 ? "threshold bold" : "threshold")
        .attr("x1", xScale(threshold))
        .attr("x2", xScale(threshold))
        .attr("y1", -innerHeight)
        .attr("y2", innerHeight * 2)
        .attr("stroke-dasharray", threshold === 0 ? "none" : "5, 5");
    });

    // bounds points to clip path
    const circleGroup = svg.append("g").attr("clip-path", "url(#clip)");

    circleGroup
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", circleClass)
      .attr("r", 7)
      .attr("cx", (d) => xScale(d[xValKey]))
      .attr("cy", (d) => yScale(d[yValKey]))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseenter", function (event, d) {
        tooltip.style("visibility", "visible").html(tooltipDetails(d));
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 5 + "px")
          .style("left", event.pageX + 20 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
      })
      .on(
        "click",
        (_, d) =>
          window.open(
            "https://salivaryproteome.org/protein/" +
              d[datakeys[0]].replace(/['"]+/g, "")
          ),
        "_blank"
      );

    const legendDict = {
      1: ["DOWN", "var(--sigfold-dot-color)"],
      2: ["NON-SIG", "var(--dot-color)"],
      3: ["UP", "var(--sig-dot-color)"],
    };

    createLegend(svg, legendDict, 20, 20, 20);

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2000])
      .translateExtent([
        [0, 0],
        [SVGwidth, SVGheight],
      ])
      .on("zoom", zoomFunction);

    svg.call(zoom);
    zoomRef.current = zoom;

    function zoomFunction(event) {
      const transform = event.transform;

      svg
        .selectAll(".dot")
        .attr("transform", transform)
        .attr("r", 7 / transform.k)
        .attr("stroke-width", 1 / transform.k);

      gX.call(xAxis.scale(transform.rescaleX(xScale)));
      gY.call(yAxis.scale(transform.rescaleY(yScale)));

      svg
        .selectAll(".threshold")
        .attr("transform", transform)
        .attr("stroke-width", 1 / transform.k)
        .attr("stroke-dasharray", function () {
          const length = 5 / transform.k;
          return `${length},${length}`;
        });

      svg
        .select(".x.grid")
        .call(
          d3
            .axisBottom(xScale)
            .ticks(10)
            .tickSize(-innerHeight)
            .tickFormat("")
            .scale(transform.rescaleX(xScale))
        );

      svg
        .select(".y.grid")
        .call(
          d3
            .axisLeft(yScale)
            .ticks(10)
            .tickSize(-innerWidth)
            .tickFormat("")
            .scale(transform.rescaleY(yScale))
        );

      document.getElementById("zoom-slider").value = event.transform.k;
    }

    function handleKeyDown(event) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
      if (event.key === "ArrowUp") {
        svg.transition().duration(100).call(zoom.scaleBy, 1.1);
      }
      if (event.key === "ArrowDown") {
        svg.transition().duration(100).call(zoom.scaleBy, 0.9);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Function that dynamically creates a tooltip for a circle
    function tooltipDetails(d) {
      var output = `<strong>Primary Accession</strong>: ${d[datakeys[0]]}`;
      details.forEach(
        (detail) =>
          (output = output.concat(
            `<br/><strong>${detail}</strong>: ${d[detail]}`
          ))
      );
      return output;
    }

    function circleClass(d) {
      if (d[yValKey] <= pval) {
        return "dot";
      } else if (d[yValKey] > pval && d[xValKey] <= -foldChange) {
        return "dot sigfold";
      } else if (d[yValKey] > pval && d[xValKey] >= foldChange) {
        return "dot sig";
      } else {
        return "dot";
      }
    }

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
      d3.select(chartRef.current)
        .selectAll("div#zoom-slider-container")
        .remove();
      tooltip.remove();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = svgRef.current,
        zoom = zoomRef.current;
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }
  };

  const resetButtonMargin = {
    top: `${margin.top + 10}px`,
    right: `${margin.right + 40}px`,
  };

  return (
    <div ref={chartRef} id="chart" className="volcano graph-container">
      {data ? (
        <div className="reset-button-container" style={resetButtonMargin}>
          <button onClick={resetZoom} className="reset-button">
            Reset
          </button>
        </div>
      ) : (
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Error: Data Unavailable
        </span>
      )}
    </div>
  );
};

export default VolcanoPlot;
