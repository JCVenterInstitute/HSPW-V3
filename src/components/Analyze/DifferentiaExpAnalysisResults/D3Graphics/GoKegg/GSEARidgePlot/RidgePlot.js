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

      setData1(result1.data.slice(0, 25)); // Select first 25 rows from Data1
      setData2(result2.data);
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

      // Calculate density values for all setSize groups
      const allDensity = [];
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
          d3.range(-10, 10),
          validData
        );
        allDensity.push(...density);

        console.log(`Density values for setSize ${setSize}:`, density);
      });

      // Calculate xScale domain based on density values
      const xDomain = d3.extent(allDensity, (d) => d[0]);
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
        .domain([0, 100]);

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
        const density = kde(kernelEpanechnikov(7), xScale.ticks(40), validData);

        const areaGenerator = d3
          .area()
          .curve(d3.curveBasis)
          .x((d) => xScale(d[0]))
          .y0(yScale(setSize) + yScale.bandwidth() / 2)
          .y1((d) => yScale(setSize) + yScale.bandwidth() / 2 - d[1] * 200);

        plot
          .append("path")
          .datum(density)
          .attr("fill", "steelblue") // Use color scale for fill based on p.adjust
          .attr("stroke", "black") // Darker stroke color
          .attr("stroke-width", 1.5) // Darker stroke width
          .attr("d", areaGenerator);
      });

      plot
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
      plot.append("g").call(d3.axisLeft(yScale));
    }
  }, [data1, data2]);

  return (
    <div className="ridgechart-container">
      <svg id="ridgeChart" className="ridgechart" ref={svgRef}></svg>
    </div>
  );
};

export default RidgePlotComponent;
