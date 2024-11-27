import React, { useEffect, useState, useRef } from "react";
import { Container } from "@mui/material";
import * as d3 from "d3v7";

import "../../D3GraphStyles.css";

const RidgePlotComponent = ({ table, all }) => {
  const svgRef = useRef();
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);

  const margin = { top: 70, right: 30, bottom: 70, left: 200 };
  const width = 900 - margin.left - margin.right;
  const height = 820 - margin.top - margin.bottom;

  // Remove all quotes from input data
  const cleanData = (data) => {
    return data.map((d) => {
      const cleanedData = {};

      for (let key in d) {
        cleanedData[key] = d[key].replaceAll(/^"|"$/g, "");
      }

      return cleanedData;
    });
  };

  // Sanitize input data file for ridge plot
  useEffect(() => {
    try {
      setTableData(cleanData(table.slice(0, 25)));
      setAllData(cleanData(all));
    } catch (error) {
      console.error("Incorrect File:", error);
    }
  }, [table, all]);

  // Render the Ridge Plot when data1 and data2 are available
  useEffect(() => {
    if (tableData.length === 0 || allData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

    const plot = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const descriptions = Array.from(
      new Set(tableData.map((d) => d["Description"]))
    );

    const kernelDensityEstimator = (kernel, X) => (V) => {
      const densities = X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
      return densities;
    };

    const kernelEpanechnikov = (k) => (v) =>
      Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

    const proteinFoldChange = {};

    allData.forEach((d) => {
      const protein = d["ENTREZID"] ? d["ENTREZID"] : d["Protein"];
      const foldChange = parseFloat(d["log2.FC."]);
      proteinFoldChange[protein] = foldChange;
    });

    const allFoldChanges = [
      ...tableData.map((d) => parseFloat(d["log2.FC."])),
      ...allData.map((d) => parseFloat(d["log2.FC."])),
    ].filter((d) => !isNaN(d));

    const [minFoldChange, maxFoldChange] = d3.extent(allFoldChanges);
    const padding = 0.2;

    const paddedMin = minFoldChange - (maxFoldChange - minFoldChange) * padding;
    const paddedMax = maxFoldChange + (maxFoldChange - minFoldChange) * padding;

    const xDomain = [paddedMin, paddedMax];

    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

    const reversedDescriptionValues = [...descriptions].reverse();

    const yScale = d3
      .scaleBand()
      .domain(reversedDescriptionValues)
      .range([height, 0])
      .padding(0.1);

    // const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 10]);

    const pAdjustScale = d3
      .scaleSequential(d3.interpolateRdBu)
      .domain(d3.extent(tableData, (d) => +d["p.adjust"]));

    const foldChangeRange = maxFoldChange - minFoldChange;
    let kernelBandwidth =
      foldChangeRange / (Math.sqrt(allFoldChanges.length) * 1.07);
    const heightMultiplier = foldChangeRange * 7;

    const kde = kernelDensityEstimator(
      kernelEpanechnikov(kernelBandwidth),
      xScale.ticks(40)
    );

    descriptions.forEach((description) => {
      const groupTableData = tableData.filter(
        (d) => d["Description"] === description
      );

      const matchedAllData = [];

      groupTableData.forEach((d1) => {
        const proteins = d1["core_enrichment"].split("/");

        proteins.forEach((protein) => {
          if (proteinFoldChange.hasOwnProperty(protein)) {
            matchedAllData.push({
              ...d1,
              "log2.FC.": proteinFoldChange[protein],
            });
          }
        });
      });

      const validData = matchedAllData.filter(
        (d) => !isNaN(d["log2.FC."]) && d["log2.FC."] !== undefined
      );

      const density = kde(validData.map((d) => d["log2.FC."]));

      const areaGenerator = d3
        .area()
        .curve(d3.curveBasis)
        .x((d) => xScale(d[0]))
        .y0(yScale(description) + yScale.bandwidth() / 2)
        .y1(
          (d) =>
            yScale(description) +
            yScale.bandwidth() / 2 -
            d[1] * heightMultiplier
        );

      plot
        .append("path")
        .datum(density)
        .attr("fill", pAdjustScale(groupTableData[0]["p.adjust"]))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", areaGenerator)
        .on("mouseover", function (event, d) {
          d3.select("#tooltip")
            .style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(
              `<strong>Description:</strong> ${description}<br>` +
                `<strong>p.adjust:</strong> ${groupTableData[0]["p.adjust"]}`
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

    //plot.append("g").call(d3.axisLeft(yScale)).selectAll(".tick text");

    plot
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .attr("x", -100)
      .style("text-anchor", "end")
      .call(wrap, margin.left - 10)
      .attr("transform", "translate(-10, 0)");

    // Wrap function if you need to wrap long y-axis labels
    //plot.selectAll(".tick text").call(wrap, margin.left - 10); // Adjust width as needed

    plot
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("log2.FC.");

    plot
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -(height / 2))
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Description");

    addLegend(plot, pAdjustScale);
  }, [tableData, allData]);

  // Adds the graph legend to the bottom left of table
  const addLegend = (plot, pAdjustScale) => {
    const legendWidth = 200;
    const legendHeight = 20;

    const legend = plot
      .append("g")
      .attr(
        "transform",
        `translate(-200, ${height * 0.8 + margin.top + margin.bottom + 25})`
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

    legend
      .append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("p.adjust");
  };

  // Function to wrap text in y-axis labels
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  return (
    <div className="ridgechart-container graph-container">
      {tableData.length === 0 ? (
        // Table Data File empty
        <Container sx={{ textAlign: "center", marginTop: "10px" }}>
          No Significant Data Found
        </Container>
      ) : (
        <>
          <svg
            id="ridgeChart"
            className="ridgechart"
            ref={svgRef}
            style={{ width: "100%", height: "auto" }} // Optional for responsive design
          ></svg>
          <div
            id="tooltip"
            className="tooltip"
            style={{ display: "none" }}
          ></div>
        </>
      )}
    </div>
  );
};

export default RidgePlotComponent;
