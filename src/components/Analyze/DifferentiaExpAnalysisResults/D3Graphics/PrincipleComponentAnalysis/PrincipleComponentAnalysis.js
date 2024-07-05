import "./principlecomponentanalysis.css";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3v7";
import { ThreeMpTwoTone } from "@mui/icons-material";
import numeric from "numeric";

const PrincipleComponentAnalysis = ({
  data = "",
  xCol = 1,
  yCol = 2,
  xlabel = "",
  ylabel = "",
}) => {
  let handleKeyDown;
  const chartRef = useRef(null),
    svgRef = useRef(null),
    zoomRef = useRef(null);

  useEffect(() => {
    const SVGwidth = chartRef.current.offsetWidth * 0.6;
    const SVGheight = SVGwidth;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = SVGwidth - margin.left - margin.right;
    const innerHeight = SVGheight - margin.top - margin.bottom;
    var groups = [];

    // Creating the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", SVGwidth)
      .attr("height", SVGheight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgRef.current = svg;

    svg.node().addEventListener("wheel", (event) => event.preventDefault());
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
    d3.csv(data, parser).then((data) => {
      console.log("Parsed Data:", data);
      var datakeys = Object.keys(data[0]),
        xValKey = datakeys[xCol],
        yValKey = datakeys[yCol];

      // Determine the dynamic scales based on the data
      const xExtent = d3.extent(data, (d) => d[xValKey] * 1.75);
      const yExtent = d3.extent(data, (d) => d[yValKey] * 1.75);

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
        .attr("transform", `translate(${innerWidth / 2},${margin.bottom - 6})`)
        .attr("text-anchor", "middle")
        .text(xlabel === "" ? xValKey : xlabel);

      // Setting up y axis
      const gY = svg.append("g").attr("class", "y axis").call(yAxis);

      // Labeling y axis
      gY.append("text")
        .attr("class", "label")
        .attr(
          "transform",
          `translate(${-margin.left / 1.25},${innerHeight / 2}) rotate(-90)`
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
        .call(
          d3.axisLeft(yScale).ticks(10).tickSize(-innerWidth).tickFormat("")
        );

      // Creates a rectangle that allows zooming to be done anywhere on the chart
      svg
        .append("rect")
        .attr("class", "zoom")
        .attr("height", innerHeight)
        .attr("width", innerWidth);

      const groupedData = d3.group(data.data, (d) => d[""].charAt(0));

      groupedData.forEach((groupData, key) => {
        const ellipseParams = calculateEllipse(groupData);
        groups.push({
          key: key,
          angle: ellipseParams.angle,
          cx: ellipseParams.cx,
          cy: ellipseParams.cy,
        });
        svg
          .append("g")
          .attr("clip-path", "url(#clip)")
          .append("ellipse")
          .attr("class", `ellipse ${key}`)
          .attr("cx", ellipseParams.cx)
          .attr("cy", ellipseParams.cy)
          .attr("rx", ellipseParams.rx)
          .attr("ry", ellipseParams.ry)
          .attr(
            "transform",
            `rotate(${ellipseParams.angle},${ellipseParams.cx},${ellipseParams.cy})`
          )
          .style("opacity", "0.2");
      });

      // bounds points to clip path
      const circleGroup = svg.append("g").attr("clip-path", "url(#clip)");

      circleGroup
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", circleClass)
        .attr("r", 6)
        .attr("cx", (d) => xScale(d[xValKey]))
        .attr("cy", (d) => yScale(d[yValKey]))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
      // .on("mouseenter", function (event, d) {
      //   tooltip.style("visibility", "visible").html(tooltipDetails(d));
      // })
      // .on("mousemove", function (event) {
      //   tooltip
      //     .style("top", event.pageY - 5 + "px")
      //     .style("left", event.pageX + 20 + "px");
      // })
      // .on("mouseleave", function () {
      //   tooltip.style("visibility", "hidden");
      // })
      // .on(
      //   "click",
      //   (_, d) =>
      //     window.open(
      //       "https://salivaryproteome.org/protein/" + d[datakeys[0]]
      //     ),
      //   "_blank"
      // );

      const legendDict = {
        1: ["CS", "Red"],
        2: ["HS", "Green"],
      };

      createLegend(svg, legendDict);

      const zoom = d3
        .zoom()
        .scaleExtent([1, 2000])
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
          .attr("r", 6 / transform.k)
          .attr("stroke-width", 2 / transform.k);

        gX.call(xAxis.scale(transform.rescaleX(xScale)));
        gY.call(yAxis.scale(transform.rescaleY(yScale)));

        groups.forEach((group) => {
          svg
            .selectAll(`.${group.key}`)
            .attr(
              "transform",
              `${transform} rotate(${group.angle},${group.cx},${group.cy})`
            );
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
      // function tooltipDetails(d) {
      //   var output = `<strong>Primary Accession</strong>: ${d[datakeys[0]]}`;
      //   details.forEach(
      //     (detail) =>
      //       (output = output.concat(
      //         `<br/><strong>${detail}</strong>: ${d[detail]}`
      //       ))
      //   );
      //   return output;
      // }

      function calculateEllipse(groupData) {
        const meanX = d3.mean(groupData, (d) => d.PC1);
        const meanY = d3.mean(groupData, (d) => d.PC2);

        const centeredData = groupData.map((d) => [
          d.PC1 - meanX,
          d.PC2 - meanY,
        ]);

        const covarianceMatrix = numeric.dot(
          numeric.transpose(centeredData),
          centeredData
        );

        // Normalize the covariance matrix by the number of points
        const n = groupData.length;
        const normalizedCovarianceMatrix = numeric.div(covarianceMatrix, n);

        const eig = numeric.eig(normalizedCovarianceMatrix);
        if (!eig.lambda) {
          console.error("Eigenvalue decomposition failed");
          return;
        }

        const eigenvalues = eig.lambda.x;
        const eigenvectors = eig.E.x;

        // Sort eigenvalues and eigenvectors
        const sortedIndices = eigenvalues
          .map((val, idx) => [val, idx])
          .sort((a, b) => a[0] - b[0])
          .map((pair) => pair[1]);

        const smallestEigenval = eigenvalues[sortedIndices[0]];
        const largestEigenval = eigenvalues[sortedIndices[1]];

        const largestEigenvec = eigenvectors[sortedIndices[1]];

        console.log(eigenvectors);

        return {
          cx: xScale(meanX),
          cy: yScale(meanY),
          rx: Math.sqrt(largestEigenval) * 90, // scaling for visualization
          ry: Math.sqrt(smallestEigenval) * 100, // scaling for visualization
          angle:
            Math.atan2(largestEigenvec[1], largestEigenvec[0]) *
            (180 / Math.PI),
        };
      }

      function circleClass(d) {
        if (d[""].startsWith("C")) {
          return "dot CS";
        } else if (d[""].startsWith("H")) {
          return "dot HS";
        }
      }
    });

    // Function to determine the class of a circle

    function parser(d) {
      for (let key in d) {
        if (d.hasOwnProperty(key)) {
          d[key] = numberParser(d[key]);
        }
      }
      return d;
    }

    function numberParser(value) {
      return +value ? +value : value;
    }

    // Function for creating a legend to be attached to a chart
    function createLegend(selection, legendDict) {
      const legend = selection
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20, 40)");

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
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legendItem
        .append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 5)
        .attr("fill", (d) => d.color);

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .text((d) => d.label);
    }

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
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

  return (
    <div ref={chartRef} id="chart" className="pca">
      <button onClick={resetZoom} className="reset-button">
        Reset Zoom
      </button>
    </div>
  );
};

export default PrincipleComponentAnalysis;
