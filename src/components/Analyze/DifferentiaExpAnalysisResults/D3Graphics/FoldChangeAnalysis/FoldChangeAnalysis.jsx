import "../D3GraphStyles.css";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3v7";
// import data from "../../data/statistical_parametric_test.csv";

// Fold.Change
// log2.FC.

const FoldChangePlot = (data, extension) => {
  const plotConfig = {
    dataFile: data,
    extension: extension,
    containerID: "statParaTest",
    width: 1600,
    height: 800,
    margin: { top: 15, right: 60, bottom: 50, left: 100 },
    pointRadius: 8,
    xAxisLabel: "",
    yAxisLabel: "Log2(FC)",
    xValue: (d, i) => i,
    yValue: (d) => d["log2.FC."],
    circleClass: (d) => {
      if (d.y <= 1) {
        return "dot";
      } else if (d.y > 1 && d.x <= -1) {
        return "dot sigfold";
      } else if (d.x > 1 && d.y >= 1) {
        return "dot sig";
      } else {
        return "dot";
      }
    },
    tooltipHTML: (d) => {
      return `<strong>Protein</strong>: ${
        d["Protein"]
      }<br/><strong>-log10(p)</strong>: ${
        d["X.log10.p."]
      }<br/><strong>FDR</strong>: ${d3.format(".2f")(
        d["FDR"]
      )}<br/><strong>PVal</strong>: ${
        d["p.value"]
      }<br/><strong>t.stat</strong>: ${d3.format(".2f")(d["t.stat"])}`;
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

    const data = plotConfig.dataFile.data;
    document.getElementById("zoom-slider").disabled = true;

    const scaleMinMax = (data) => {
      // Returns an array for the max and min of a scale domain.
      // Scale is balanced on either side of zero and padded to
      // move data a bit to the center.
      const dataMax = d3.max(data, yValue);
      const dataMin = d3.min(data, yValue);
      if (Math.abs(dataMin) > dataMax) {
        return [dataMin * 1.2, dataMin * -1.2];
      } else {
        return [dataMax * -1.2, dataMax * 1.2];
      }
    };
    const xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([-3, Object.keys(data).length + 3])
      .nice();
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain(scaleMinMax(data))
      .nice();

    const xAxisBottom = svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${height / 2})`);

    const yAxisLeft = svg.append("g").attr("class", "yAxis");
    const yAxisRight = svg
      .append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${width}, 0)`);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    xAxisBottom
      .call(d3.axisBottom(xScale).tickSize(-1))
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("class", "axis")
      .text(xAxisLabel);

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
        xAxisBottom.attr("transform", `translate(0, ${zy(0)})`);
        yAxisLeft.call(d3.axisLeft(zy));
        yAxisRight.call(d3.axisRight(zy));
        svg
          .selectAll("circle")
          .attr("cx", (d, i) => zx(xValue(d, i)))
          .attr("cy", (d) => zy(yValue(d)));
        // Sync zoom level to the slider
        document.getElementById("zoom-slider").value = event.transform.k;
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

  return (
    <div id="FoldChangeGraph" ref={containerRef} style={{ width: "90%" }}>
      <div className="reset-button-container">
        <button onClick={resetZoom} className="reset-button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default FoldChangePlot;