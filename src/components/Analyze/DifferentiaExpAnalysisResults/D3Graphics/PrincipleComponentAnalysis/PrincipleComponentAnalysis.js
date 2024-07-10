import React, { useEffect, useRef } from "react";
import * as d3 from "d3v7";
import "../D3GraphStyles.css";
import { create } from "@mui/material/styles/createTransitions";
// import data from "../../data/statistical_parametric_test.csv";

const PrincipleComponentAnalysis = ({
  data,
  groupLabels,
  groupMapping,
  extension,
}) => {
  console.log(groupMapping);

  const plotConfig = {
    dataFile: data,
    extension: extension,
    groupLables: groupLabels,
    groupMapping: groupMapping,
    containerID: "PCAtest",
    width: 600,
    height: 450,
    margin: { top: 10, right: 60, bottom: 50, left: 100 },
    pointRadius: 8,
    xAxisLabel: "PC 1 (25.5%)",
    yAxisLabel: "PC 2 (12.5%)",
    xValue: (d) => +d["PC1"],
    yValue: (d) => +d["PC2"],
    circleClass: (d) => {
      if (groupMapping[d["Protein"].replaceAll('"', "")] === groupLabels[0]) {
        console.log("A");
        return "dot sigfold";
      } else {
        console.log("B");
        return "dot sig";
      }
    },
    tooltipHTML: (d) => {
      return `<strong>Protein</strong>: ${d["Protein"]}
      <br/><strong>Group</strong>: ${
        groupMapping[d["Protein"].replaceAll('"', "")]
      }
      <br/><strong>PC1</strong>: ${d3.format(".2f")(d["PC1"])}
      <br/><strong>PC2</strong>: ${d3.format(".2f")(d["PC2"])}`;
    },
  };

  const chartRef = useRef(null),
    svgRef = useRef(null),
    zoomRef = useRef(null);

  const createScatterPlot = async (config, containerRef) => {
    const {
      dataFile,
      width,
      height,
      margin,
      pointRadius,
      xAxisLabel,
      yAxisLabel,
      xValue,
      yValue,
      circleClass,
      tooltipHTML,
    } = config;

    // Clear existing SVG elements
    d3.select(containerRef.current).selectAll("svg").remove();
    d3.select(containerRef.current).selectAll("div").remove();

    const parentContainer = d3.select(containerRef.current);
    const svg = parentContainer
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    svgRef.current = svg;
    const clipPath = svg
      .append("clipPath")
      .attr("id", "clipRect")
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    svg.node().addEventListener("wheel", (event) => event.preventDefault());
    // Append slider in the container for better layout control
    const slider = parentContainer
      .append("div")
      .attr("id", "zoom-slider-container")
      .append("input")
      .attr("type", "range")
      .attr("id", "zoom-slider")
      .attr("class", "sleek-slider")
      .attr("min", "0.5")
      .attr("max", "20")
      .attr("step", "0.1")
      .attr("value", "1")
      .style("width", "50%");

    document.getElementById("zoom-slider").disabled = true;

    const data = plotConfig.dataFile;
    const xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain(d3.extent(data, xValue))
      .nice();

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain(d3.extent(data, yValue))
      .nice();

    const xAxisBottom = svg
      .append("g")
      .attr("transform", `translate(0,${height})`);
    const xAxisTop = svg.append("g");

    const yAxisLeft = svg.append("g");
    const yAxisRight = svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`);

    var gridLines = svg.append("g").attr("class", "grid");

    // Setup horizontal grid lines
    gridLines
      .append("g")
      .attr("class", "x grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(""));

    // Setup vertical grid lines
    gridLines
      .append("g")
      .attr("class", "y grid")
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""));

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    xAxisBottom
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("class", "axis")
      .text(xAxisLabel);
    xAxisTop.append("line");

    yAxisLeft
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("class", "axis")
      .text(yAxisLabel);
    yAxisRight
      .call(d3.axisRight(yScale))
      .append("text")

      //   .attr("transform", "rotate(-90)")

      .attr("x", -height / 2)
      .attr("y", -margin.right + 20)
      .attr("class", "axis")
      .attr("fill", "black");

    var zoomBox = svg
      .append("rect")
      .attr("class", "zoom")
      .attr("height", height)
      .attr("width", width);

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20])
      .translateExtent([
        [0, 0],
        [width, height],
      ])

      .on("zoom", (event) => {
        const zx = event.transform.rescaleX(xScale);
        const zy = event.transform.rescaleY(yScale);
        xAxisBottom.call(d3.axisBottom(zx));
        yAxisLeft.call(d3.axisLeft(zy));
        yAxisRight.call(d3.axisRight(zy));
        svg
          .selectAll("circle")
          .attr("cx", (d, i) => zx(xValue(d, i)))
          .attr("cy", (d) => zy(yValue(d)));
        // Sync zoom level to the slider
        document.getElementById("zoom-slider").value = event.transform.k;
        svg
          .select(".x.grid")
          .call(
            d3
              .axisBottom(xScale)
              .ticks(10)
              .tickSize(-height)
              .tickFormat("")
              .scale(event.transform.rescaleX(xScale))
          );
        svg
          .select(".y.grid")
          .call(
            d3
              .axisLeft(yScale)
              .ticks(10)
              .tickSize(-width)
              .tickFormat("")
              .scale(event.transform.rescaleY(yScale))
          );
        svg
          .selectAll(".threshold")
          .attr("y1", zy(-1 * Math.log10(0.05)))
          .attr("y2", zy(-1 * Math.log10(0.05)));
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    const pltPointsGroup = svg
      .append("g")
      .attr("id", "points-group")
      .attr("clip-path", "url(#clipRect)")
      .attr("height", height)
      .attr("width", width);

    const pltPoints = pltPointsGroup
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(xValue(d, i)))
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("r", pointRadius)
      .attr("class", circleClass)
      .on("mouseover", (_, d) => {
        tooltip.html(tooltipHTML(d)).style("visibility", "visible");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on(
        "click",
        (_, d) =>
          window.open(
            "https://salivaryproteome.org/protein/" +
              d["Protein"].replace(/^"(.*)"$/, "$1")
          ),
        "_blank"
      );
  };

  const containerRef = useRef(null);

  useEffect(() => {
    createScatterPlot(plotConfig, containerRef);
  }, []);

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = svgRef.current,
        zoom = zoomRef.current;
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }
  };

  const resetButtonMargin = {
    top: `${plotConfig.margin.top + 10}px`,
    right: `${plotConfig.margin.right + 40}px`,
  };

  return (
    <div id="PCATest" ref={containerRef}>
      <div className="reset-button-container" style={resetButtonMargin}>
        <button onClick={resetZoom} className="reset-button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default PrincipleComponentAnalysis;
