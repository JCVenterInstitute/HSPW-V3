import React, { useEffect, useRef } from "react";
import numeric from "numeric";
import * as d3 from "d3v7";
import "../D3GraphStyles.css";

const PrincipleComponentAnalysis = ({
  data,
  groupLabels,
  groupMapping,
  pcaVariance,
  extension,
}) => {
  // Configuration for the plot
  const plotConfig = {
    dataFile: data,
    extension: extension,
    groupLabels: groupLabels,
    groupMapping: groupMapping,
    pcaVariance: pcaVariance,
    width: 600,
    height: 450,
    margin: { top: 10, right: 60, bottom: 70, left: 100 },
    pointRadius: 8,
    xAxisLabel: `PC 1 (${d3.format(".2f")(pcaVariance[0]["x"] * 100)}%)`,
    yAxisLabel: `PC 2 (${d3.format(".2f")(pcaVariance[1]["x"] * 100)}%)`,
    xValue: (d) => +d["PC1"],
    yValue: (d) => +d["PC2"],
    circleClass: (d) => {
      return groupMapping[d["Protein"].replaceAll('"', "")] === groupLabels[0]
        ? "dot sigfold"
        : "dot sig";
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

  console.log(pcaVariance);
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const zoomRef = useRef(null);

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

    // Define clip path
    svg
      .append("clipPath")
      .attr("id", "clipRect")
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Prevent default wheel behavior
    svg.node().addEventListener("wheel", (event) => event.preventDefault());

    // Append slider for zoom control
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

    // Append axes
    const xAxisBottom = svg
      .append("g")
      .attr("transform", `translate(0,${height})`);
    const xAxisTop = svg.append("g");
    const yAxisLeft = svg.append("g");
    const yAxisRight = svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`);

    // Append grid lines
    const gridLines = svg.append("g").attr("class", "grid");
    gridLines
      .append("g")
      .attr("class", "x grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(""))
      .call((g) =>
        g
          .selectAll("line")
          .filter((d) => d === 0)
          .classed("axis-zero", true)
      );

    gridLines
      .append("g")
      .attr("class", "y grid")
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""))
      .call((g) =>
        g
          .selectAll("line")
          .filter((d) => d === 0)
          .classed("axis-zero", true)
      );

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    // Append and label x-axis
    xAxisBottom
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("transform", `translate(0, 60)`)
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("class", "axis")
      .text(xAxisLabel);

    // Append and label y-axis
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
    yAxisRight.call(d3.axisRight(yScale));

    // Append zoom rectangle
    svg
      .append("rect")
      .attr("class", "zoom")
      .attr("height", height)
      .attr("width", width);

    // Define zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20])
      .translateExtent([
        [-margin.left, -margin.top],
        [width + margin.right, height + margin.bottom],
      ])
      .extent([
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

    // Append data points
    const pltPointsGroup = svg
      .append("g")
      .attr("id", "points-group")
      .attr("clip-path", "url(#clipRect)")
      .attr("height", height)
      .attr("width", width);
    pltPointsGroup
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
      .on("click", (_, d) =>
        window.open(
          "https://salivaryproteome.org/protein/" +
            d["Protein"].replace(/^"(.*)"$/, "$1")
        )
      );

    // Append ellipses
    const groupData = d3.groups(
      data,
      (d) => groupMapping[d["Protein"].replaceAll('"', "")]
    );
    groupData.forEach(([group, values]) => {
      const meanX = d3.mean(values, xValue);
      const meanY = d3.mean(values, yValue);
      const covarianceMatrix = calculateCovarianceMatrix(
        values.map(xValue),
        values.map(yValue)
      );
      const [a, b, angle] = getEllipseParameters(covarianceMatrix);
      svg
        .append("ellipse")
        .attr("class", "ellipse")
        .attr("cx", xScale(meanX))
        .attr("cy", yScale(meanY))
        .attr("rx", xScale(meanX + a) - xScale(meanX))
        .attr("ry", yScale(meanY + b) - yScale(meanY))
        .attr("transform", `rotate(${(angle * 180) / Math.PI})`)
        .style("fill", "none")
        .style("stroke", "black");
    });
  };

  // Calculate covariance matrix
  const calculateCovarianceMatrix = (x, y) => {
    const meanX = d3.mean(x);
    const meanY = d3.mean(y);
    let covarianceXX = 0,
      covarianceXY = 0,
      covarianceYY = 0;
    for (let i = 0; i < x.length; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      covarianceXX += dx * dx;
      covarianceXY += dx * dy;
      covarianceYY += dy * dy;
    }
    const n = x.length;
    return [
      [covarianceXX / n, covarianceXY / n],
      [covarianceXY / n, covarianceYY / n],
    ];
  };

  // Calculate ellipse parameters
  const getEllipseParameters = (covarianceMatrix) => {
    const eigen = numeric.eig(covarianceMatrix);
    const eigenValues = eigen.lambda["x"];
    const eigenVectors = eigen.E["x"];
    const a = Math.sqrt(eigenValues[0]);
    const b = Math.sqrt(eigenValues[1]);
    console.log(eigen);
    const angle = Math.atan2(eigenVectors[1][0], eigenVectors[0][0]);
    return [a, b, angle];
  };

  const containerRef = useRef(null);

  useEffect(() => {
    createScatterPlot(plotConfig, containerRef);
  }, []);

  // Function to reset zoom
  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = svgRef.current;
      const zoom = zoomRef.current;
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
