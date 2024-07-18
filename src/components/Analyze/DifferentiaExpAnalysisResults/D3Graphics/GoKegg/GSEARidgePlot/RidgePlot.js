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

  const margin = { top: 70, right: 30, bottom: 0, left: 150 };
  const width = 900 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const cleanData = (data) => {
    return data.map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replaceAll(/^"|"$/g, "");
      }
      return cleanedData;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading data...");
      const result1 = await fetchTSV(jobId, fileName1, selectedSection);
      const result2 = await fetchCSV(jobId, fileName2, selectedSection);

      console.log("Raw Data1:", result1.data);
      console.log("Raw Data2:", result2.data);

      setData1(cleanData(result1.data.slice(0, 25)));
      setData2(cleanData(result2.data));
    };

    loadData();
  }, [jobId, fileName1, fileName2, selectedSection]);

  useEffect(() => {
    if (data1.length > 0 && data2.length > 0) {
      console.log("Data1 and Data2 are available for processing.");

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
      console.log("Unique setSize values:", setSizeValues);

      const kernelDensityEstimator = (kernel, X) => (V) => {
        console.log("X values for KDE:", X);
        console.log("V values for KDE:", V);
        const densities = X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);

        return densities;
      };

      const kernelEpanechnikov = (k) => (v) =>
        Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

      const proteinFoldChange = {};
      data2.forEach((d) => {
        const protein = d["Protein"];
        const foldChange = parseFloat(d["Fold.Change"]);
        proteinFoldChange[protein] = foldChange;
      });

      // Calculate the dynamic x-axis domain based on Fold.Change values
      const allFoldChanges = [
        ...data1.map((d) => parseFloat(d["Fold.Change"])),
        ...data2.map((d) => parseFloat(d["Fold.Change"])),
      ].filter((d) => !isNaN(d));

      const [minFoldChange, maxFoldChange] = d3.extent(allFoldChanges);
      const padding = 0.2; // 10% padding on both sides

      // Apply padding
      const paddedMin =
        minFoldChange - (maxFoldChange - minFoldChange) * padding;
      const paddedMax =
        maxFoldChange + (maxFoldChange - minFoldChange) * padding;

      const xDomain = [paddedMin, paddedMax];
      console.log("Padded xDomain:", xDomain);

      const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

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
        .scaleSequential(d3.interpolateRdBu)
        .domain(d3.extent(data1, (d) => +d["p.adjust"]));

      const kde = kernelDensityEstimator(
        kernelEpanechnikov(2000),
        xScale.ticks(40)
      );

      setSizeValues.forEach((setSize) => {
        const groupData1 = data1.filter((d) => d.setSize === setSize);
        console.log(`Group Data1 for setSize ${setSize}:`, groupData1);

        const matchedData2 = [];
        groupData1.forEach((d1) => {
          const proteins = d1["Unnamed Column"].split("/");
          proteins.forEach((protein) => {
            if (proteinFoldChange.hasOwnProperty(protein)) {
              matchedData2.push({
                ...d1,
                "Fold.Change": proteinFoldChange[protein],
              });
            }
          });
        });
        console.log(`Matched Data2 for setSize ${setSize}:`, matchedData2);

        const validData = matchedData2.filter(
          (d) => !isNaN(d["Fold.Change"]) && d["Fold.Change"] !== undefined
        );
        console.log(`Valid Data for setSize ${setSize}:`, validData);

        const density = kde(validData.map((d) => d["Fold.Change"]));
        console.log("Density for setSize:", setSize, density);

        const areaGenerator = d3
          .area()
          .curve(d3.curveBasis)
          .x((d) => xScale(d[0]))
          .y0(yScale(setSize) + yScale.bandwidth() / 2)
          .y1((d) => yScale(setSize) + yScale.bandwidth() / 2 - d[1] * 200000);

        plot
          .append("path")
          .datum(density)
          .attr("fill", pAdjustScale(groupData1[0]["p.adjust"]))
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .attr("d", areaGenerator)
          .on("mouseover", function (event, d) {
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
            d3.select("#tooltip").style("display", "none");
          });
      });

      plot
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(-height - 55)
            .tickFormat(d3.format(".2f"))
        )
        .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0.2))
        .call((g) => g.selectAll(".tick text").attr("y", 10));

      plot.append("g").call(d3.axisLeft(yScale));

      // Add legend for p.adjust
      const legendWidth = 300;
      const legendHeight = 10;

      const legend = plot
        .append("g")
        .attr(
          "transform",
          `translate(${(width - legendWidth) / 2}, ${height + margin.top})`
        );

      const legendScale = d3
        .scaleLinear()
        .domain(pAdjustScale.domain())
        .range([0, legendWidth]);

      const legendAxis = d3
        .axisBottom(legendScale)
        .ticks(5)
        .tickSize(-legendHeight);

      legend
        .selectAll("rect")
        .data(pAdjustScale.ticks(legendWidth))
        .enter()
        .append("rect")
        .attr("x", (d) => legendScale(d))
        .attr("y", 0)
        .attr("width", legendWidth / pAdjustScale.ticks(legendWidth).length)
        .attr("height", legendHeight)
        .attr("fill", (d) => pAdjustScale(d));

      legend
        .append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("stroke", "#777")
            .attr("stroke-dasharray", "2,2")
        )
        .call((g) => g.selectAll(".tick text").attr("y", 10));

      // Add legend title
      legend
        .append("text")
        .attr("x", legendWidth / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("p.adjust");
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
