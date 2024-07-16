import "../D3GraphStyles.css";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3v7";
// import data from "../../data/statistical_parametric_test.csv";

// Fold.Change
// log2.FC.

const FoldChangePlot = ({ data, fc }) => {
  const plotConfig = {
    dataFile: data,
    threshold1: Number(fc),
    threshold2: Number(fc) * -1,
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
    legendDict: {
      1: ["Significant", "#ff5733"],
      2: ["Non-Significant", "Gray"],
    },
  };

  const chartRef = useRef(null),
    svgRef = useRef(null),
    zoomRef = useRef(null);

  const createScatterPlot = async (config, containerRef) => {
    const {
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
    d3.select(containerRef.current)
      .selectAll("div#zoom-slider-container")
      .remove();

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

    const data = plotConfig.dataFile;
    document.getElementById("zoom-slider").disabled = true;

    const scaleMinMax = (data) => {
      // Returns an array for the max and min of a scale domain.
      // Scale is balanced on either side of zero and padded to
      // move data a bit to the center.
      const dataMax = d3.max(data, yValue);
      const dataMin = d3.min(data, yValue);
      if (Math.abs(dataMin) > dataMax) {
        return [dataMin * 1.5, dataMin * -1.5];
      } else {
        return [dataMax * -1.5, dataMax * 1.5];
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

    const thresholdLines = svg
      .append("g")
      .attr("class", "thresholdLines")
      .attr("clip-path", "url(#clipRect)")
      .attr("height", height)
      .attr("width", width);

    const threshold1 = config.threshold1;
    const threshold2 = config.threshold2;
    const thresholdLine1 = thresholdLines
      .append("svg:line")
      .attr("class", "threshold")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(threshold1))
      .attr("y2", yScale(threshold1))
      .attr("stroke-dasharray", "5, 5");

    const thresholdLine2 = thresholdLines
      .append("svg:line")
      .attr("class", "threshold")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(threshold2))
      .attr("y2", yScale(threshold2))
      .attr("stroke-dasharray", "5, 5");

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
        // xAxisBottom.call(d3.axisBottom(zx));
        xAxisBottom.attr("transform", `translate(0, ${zy(0)})`);
        yAxisLeft.call(d3.axisLeft(zy));
        yAxisRight.call(d3.axisRight(zy));
        svg
          .selectAll("circle")
          .attr("cx", (d, i) => zx(xValue(d, i)))
          .attr("cy", (d) => zy(yValue(d)));
        // Sync zoom level to the slider
        document.getElementById("zoom-slider").value = event.transform.k;
        thresholdLine1.attr("y1", zy(threshold1)).attr("y2", zy(threshold1));
        thresholdLine2.attr("y1", zy(threshold2)).attr("y2", zy(threshold2));
      });

    svg.call(zoom);
    zoomRef.current = zoom;
    Number.prototype.between = function (a, b) {
      var min = Math.min(a, b),
        max = Math.max(a, b);

      return this > min && this < max;
    };
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
      .attr("class", (d) => {
        const cyValue = yValue(d);
        return Number(cyValue).between(threshold1, threshold2)
          ? "dot"
          : "dot sig";
      })
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
    function createLegend(selection, legendDict) {
      const legend = selection
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(25, 40)");

      const legendItems = Object.keys(legendDict).map((key) => ({
        key,
        label: legendDict[key][0],
        color: legendDict[key][1],
      }));

      const legendItem = legend
        .selectAll(".legend-item")
        .data(legendItems)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0,${i * 40})`);

      legendItem
        .append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 10)
        .attr("fill", (d) => d.color);

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .attr("transform", `translate(8, 6)`)
        .text((d) => d.label);
    }
    createLegend(svg, config.legendDict);
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
    right: `${plotConfig.margin.right + 10}px`,
  };

  return (
    <div id="FoldChangeGraph" ref={containerRef}>
      <div className="reset-button-container" style={resetButtonMargin}>
        <button onClick={resetZoom} className="reset-button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default FoldChangePlot;
