import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchDataFile } from "../../../utils";

const RidgePlotComponent = ({
  jobId,
  fileName1,
  fileName2,
  selectedSection,
}) => {
  const svgRef = useRef();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const margin = { top: 80, right: 30, bottom: 70, left: 180 };
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
      const result1 = await fetchDataFile(jobId, fileName1, selectedSection);
      const result2 = await fetchDataFile(jobId, fileName2, selectedSection);

      console.log("Raw Data1:", result1.data);
      console.log("Raw Data2:", result2.data);

      setData1(cleanData(result1.data.slice(0, 25)));
      setData2(cleanData(result2.data));

      console.log("clean Data1:", data1);
      console.log("clean Data2:", data2);
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

      const DescriptionValues = Array.from(
        new Set(
          data1.map((d) => {
            console.log(d);
            return d["Description"];
          })
        )
      );
      console.log("Unique description values:", DescriptionValues);

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

      const allFoldChanges = [
        ...data1.map((d) => parseFloat(d["Fold.Change"])),
        ...data2.map((d) => parseFloat(d["Fold.Change"])),
      ].filter((d) => !isNaN(d));

      const [minFoldChange, maxFoldChange] = d3.extent(allFoldChanges);
      const padding = 0.2;

      const paddedMin =
        minFoldChange - (maxFoldChange - minFoldChange) * padding;
      const paddedMax =
        maxFoldChange + (maxFoldChange - minFoldChange) * padding;

      const xDomain = [paddedMin, paddedMax];
      console.log("Padded xDomain:", xDomain);

      const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

      const reversedSetSizeValues = [...DescriptionValues].reverse();
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

      const foldChangeRange = maxFoldChange - minFoldChange;
      console.log(">>>>>>>>>foldChangeRange:", foldChangeRange);
      let kernelBandwidth =
        foldChangeRange / (Math.sqrt(allFoldChanges.length) * 1.07);
      const heightMultiplier = foldChangeRange * 7;

      const kde = kernelDensityEstimator(
        kernelEpanechnikov(kernelBandwidth),
        xScale.ticks(40)
      );

      DescriptionValues.forEach((Description) => {
        const groupData1 = data1.filter(
          (d) => d["Description"] === Description
        );
        console.log(`Group Data1 for Description ${Description}:`, groupData1);

        const matchedData2 = [];
        groupData1.forEach((d1) => {
          const proteins = d1["core_enrichment"].split("/");
          proteins.forEach((protein) => {
            if (proteinFoldChange.hasOwnProperty(protein)) {
              matchedData2.push({
                ...d1,
                "Fold.Change": proteinFoldChange[protein],
              });
            }
          });
        });
        console.log(
          `Matched Data2 for Description ${Description}:`,
          matchedData2
        );

        const validData = matchedData2.filter(
          (d) => !isNaN(d["Fold.Change"]) && d["Fold.Change"] !== undefined
        );
        console.log(`Valid Data for Description ${Description}:`, validData);

        const density = kde(validData.map((d) => d["Fold.Change"]));
        console.log("Density for Description:", Description, density);

        const areaGenerator = d3
          .area()
          .curve(d3.curveBasis)
          .x((d) => xScale(d[0]))
          .y0(yScale(Description) + yScale.bandwidth() / 2)
          .y1(
            (d) =>
              yScale(Description) +
              yScale.bandwidth() / 2 -
              d[1] * heightMultiplier
          );

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
                `<strong>Description:</strong> ${Description}<br>` +
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
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top - 10})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Fold Change");

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -(height / 2))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Description");

      const legendWidth = 300;
      const legendHeight = 10;

      const legend = plot
        .append("g")
        .attr(
          "transform",
          `translate(${(width - legendWidth) / 2}, ${height + margin.top + 40})`
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
    }
  }, [data1, data2]);

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
      <svg id="ridgeChart" className="ridgechart" ref={svgRef}></svg>
      <div id="tooltip" className="tooltip" style={{ display: "none" }}></div>
    </div>
  );
};

export default RidgePlotComponent;
