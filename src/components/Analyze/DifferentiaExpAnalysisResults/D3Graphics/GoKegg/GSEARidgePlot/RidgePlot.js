import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchTSV, fetchCSV } from "../../../utils";

const RidgePlotComponent = ({
  jobId,
  fileName1,
  fileName2,
  selectedSection,
}) => {
  const svgRef = useRef();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const margin = { top: 20, right: 30, bottom: 40, left: 150 };
  const width = 900 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  useEffect(() => {
    const loadData = async () => {
      const result1 = await fetchTSV(jobId, fileName1, selectedSection);
      const result2 = await fetchCSV(jobId, fileName2, selectedSection);

      // Remove double quotes from all fields in result1.data and result2.data
      const cleanData1 = result1.data.slice(0, 25).map((d) => {
        const cleanedData = {};
        for (let key in d) {
          cleanedData[key] = d[key].replaceAll(/^"|"$/g, "");
        }
        return cleanedData;
      });

      const cleanData2 = result2.data.map((d) => {
        const cleanedData = {};
        for (let key in d) {
          cleanedData[key] = d[key].replaceAll(/^"|"$/g, "");
        }
        return cleanedData;
      });

      setData1(cleanData1);
      setData2(cleanData2);
    };

    loadData();
  }, [jobId, fileName1, fileName2, selectedSection]);

  useEffect(() => {
    if (data1.length > 0 && data2.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const plot = svg
        .append("svg")
        .attr("class", "chart")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const setSizeValues = Array.from(new Set(data1.map((d) => d.setSize)));

      // Kernel density estimation function
      const kde = (kernel, thresholds, data) => {
        return thresholds.map((t) => [
          t,
          d3.mean(data, (d) => kernel(t - +d["Fold.Change"])),
        ]);
      };

      // Epanechnikov kernel function
      const kernelEpanechnikov = (k) => (v) =>
        Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

      // Calculate xScale domain based on density values
      const xDomain = [-100, 100];
      const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

      // Reverse the setSizeValues to flip the order of y-axis
      const reversedSetSizeValues = [...setSizeValues].reverse();

      const yScale = d3
        .scaleBand()
        .domain(reversedSetSizeValues)
        .range([height, 0])
        .padding(0.1);

      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, 10]);

      const pAdjustScale = d3
        .scaleSequential(d3.interpolateReds)
        .domain(d3.extent(data1, (d) => +d["p.adjust"]));

      setSizeValues.forEach((setSize) => {
        const groupData1 = data1.filter((d) => d.setSize === setSize);
        const matchedData2 = groupData1.map((d1) => {
          const matched = data2.find((d2) => {
            let cleanProtein = d2["Protein"].replace(`"`, "");
            return d1["Unnamed Column"].includes(cleanProtein);
          });
          return { ...d1, ...matched };
        });

        const validData = matchedData2.filter(
          (d) => !isNaN(d["Fold.Change"]) && d["Fold.Change"] !== undefined
        );
        const density = kde(
          kernelEpanechnikov(7),
          d3.range(-100, 100),
          validData
        );

        const areaGenerator = d3
          .area()
          .curve(d3.curveBasis)
          .x((d) => xScale(d[0]))
          .y0(yScale(setSize) + yScale.bandwidth() / 2)
          .y1((d) => yScale(setSize) + yScale.bandwidth() / 2 - d[1] * 200);

        plot
          .append("path")
          .datum(density)
          .attr("fill", pAdjustScale(groupData1[0]["p.adjust"])) // Use pAdjustScale for fill color
          .attr("stroke", "black") // Darker stroke color
          .attr("stroke-width", 1.5) // Darker stroke width
          .attr("d", areaGenerator)
          .on("mouseover", function (event, d) {
            // Tooltip on mouseover
            const [x, y] = d3.pointer(event);
            d3.select("#tooltip")
              .style("display", "block")
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 10}px`)
              .html(
                `<strong>setSize:</strong> ${setSize}<br>` +
                  `<strong>p.adjust:</strong> ${groupData1[0]["p.adjust"]}`
              );
          })
          .on("mouseout", function () {
            // Hide tooltip on mouseout
            d3.select("#tooltip").style("display", "none");
          });
      });

      plot
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
      plot.append("g").call(d3.axisLeft(yScale));

      // // Add Legend for p.adjust colors
      // const legendHeight = 150;
      // const legendWidth = 18;

      // const legend = svg
      //   .append("g")
      //   .attr("id", "ridgePlotLegend")
      //   .attr(
      //     "transform",
      //     `translate(${width - 0},${height - legendHeight - 0})`
      //   );

      // const defs = legend.append("defs");

      // const linearGradient = defs
      //   .append("linearGradient")
      //   .attr("id", "linear-gradient")
      //   .attr("x1", "0%")
      //   .attr("y1", "100%")
      //   .attr("x2", "0%")
      //   .attr("y2", "0%");

      // linearGradient
      //   .append("stop")
      //   .attr("offset", "0%")
      //   .attr("stop-color", "red");

      // linearGradient
      //   .append("stop")
      //   .attr("offset", "100%")
      //   .attr("stop-color", "brown");

      // legend
      //   .append("rect")
      //   .attr("width", legendWidth)
      //   .attr("height", legendHeight)
      //   .style("fill", "url(#linear-gradient)");

      // // Add text labels to the legend
      // legend
      //   .append("text")
      //   .attr("x", legendWidth / 2)
      //   .attr("y", -5) // Adjust the y position for the text
      //   .attr("text-anchor", "middle")
      //   .text("p.adjust")
      //   .style("font-size", "12px")
      //   .style("fill", "#333"); // Adjust font size and color as needed

      // const legendScale = d3
      //   .scaleLinear()
      //   .domain(d3.extent(data1, (d) => +d["p.adjust"]))
      //   .range([legendHeight, 0]);

      // const legendAxis = d3.axisRight(legendScale).ticks(5);

      // legend
      //   .append("g")
      //   .attr("class", "axis legend-axis")
      //   .attr("transform", `translate(${legendWidth}, 0)`)
      //   .call(legendAxis);
    }
  }, [data1, data2]);

  return (
    <div className="ridgechart-container">
      <svg id="ridgeChart" className="ridgechart" ref={svgRef}></svg>
      <div id="tooltip" className="tooltip" style={{ display: "none" }}></div>
    </div>
  );
};

export default RidgePlotComponent;
