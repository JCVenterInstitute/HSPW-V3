import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";

/**
 * RidgePlotComponent
 *
 * A React component that renders a ridge plot (density plot) using D3.js. The plot displays density curves for various descriptions based on provided data,
 * and includes tooltips with detailed information about each density curve. It also features a color gradient legend representing the range of p.adjust values.
 *
 * Props:
 * - tableData (Array): An array of objects containing the first dataset to be used for the plot. Each object should have:
 *   - Description (string): The description or label for the density curve.
 *   - Fold.Change (number): The fold change value used for density estimation.
 *   - core_enrichment (string): A list of proteins related to the description, separated by slashes.
 *   - p.adjust (number): The p.adjust value used for coloring the density curve.
 *
 * - allData (Array): An array of objects containing the second dataset for matching proteins and fold change values. Each object should have:
 *   - Protein (string): The protein name.
 *   - Fold.Change (number): The fold change value for the protein.
 *
 * Usage:
 * <RidgePlotComponent tableData={tableData} allData={allData} />
 *
 * Where `tableData` and `allData` are arrays of objects with fields such as Description, Fold.Change, core_enrichment, Protein, and p.adjust.
 *
 * Behavior:
 * - Cleans data by removing quotes from relevant fields.
 * - Limits the number of rows from `tableData` to the first 25.
 * - Renders a ridge plot with density curves for each unique description.
 * - Adds a tooltip displaying detailed information when hovering over density curves.
 * - Includes a color gradient legend representing the range of p.adjust values.
 * - Implements x-axis and y-axis scales and labels for the plot.
 */

const RidgePlotComponent = ({ tableData, allData }) => {
  const svgRef = useRef(); // Reference to the SVG element
  const [data1, setData1] = useState([]); // State to store cleaned data1
  const [data2, setData2] = useState([]); // State to store cleaned data2

  // Margins and dimensions for the SV
  const margin = { top: 80, right: 30, bottom: 150, left: 200 };
  const width = 900 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;

  // Function to clean data by removing quotes
  const cleanData = (data) => {
    return data.map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replaceAll(/^"|"$/g, "");
      }
      return cleanedData;
    });
  };

  // Update data1 and data2 when tableData or allData change
  useEffect(() => {
    try {
      setData1(cleanData(tableData.slice(0, 25)));
      setData2(cleanData(allData));
    } catch (error) {
      console.error("Incorrect File:", error);
    }
  }, [tableData, allData]);

  // Render the Ridge Plot when data1 and data2 are available
  useEffect(() => {
    if (data1.length > 0 && data2.length > 0) {
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

      // Extract unique Description values for y-axis
      const DescriptionValues = Array.from(
        new Set(
          data1.map((d) => {
            return d["Description"];
          })
        )
      );
      // Kernel density estimator function
      const kernelDensityEstimator = (kernel, X) => (V) => {
        const densities = X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);

        return densities;
      };

      // Epanechnikov kernel function
      const kernelEpanechnikov = (k) => (v) =>
        Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

      // Map proteins to their fold change values
      const proteinFoldChange = {};
      data2.forEach((d) => {
        const protein = d["Protein"];
        const foldChange = parseFloat(d["Fold.Change"]);
        proteinFoldChange[protein] = foldChange;
      });

      // Combine all fold change values for scaling
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

      // Create x-axis scale
      const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

      // Create y-axis scale with reversed Description values
      const reversedDescriptionValues = [...DescriptionValues].reverse();
      const yScale = d3
        .scaleBand()
        .domain(reversedDescriptionValues)
        .range([height, 0])
        .padding(0.1);

      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, 10]);

      const pAdjustScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain(d3.extent(data1, (d) => +d["p.adjust"]));

      const foldChangeRange = maxFoldChange - minFoldChange;
      let kernelBandwidth =
        foldChangeRange / (Math.sqrt(allFoldChanges.length) * 1.07);
      const heightMultiplier = foldChangeRange * 7;

      // Kernel density estimator
      const kde = kernelDensityEstimator(
        kernelEpanechnikov(kernelBandwidth),
        xScale.ticks(40)
      );

      // Iterate over each Description to plot densities
      DescriptionValues.forEach((Description) => {
        const groupData1 = data1.filter(
          (d) => d["Description"] === Description
        );

        // Find matching data from data2
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

        // Filter out invalid fold change values
        const validData = matchedData2.filter(
          (d) => !isNaN(d["Fold.Change"]) && d["Fold.Change"] !== undefined
        );

        // Calculate density for the current Description
        const density = kde(validData.map((d) => d["Fold.Change"]));

        // Define area generator for the density plot
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

        // Append the path for the density plot
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

      plot
        .append("g")
        .call(d3.axisLeft(yScale))
        .selectAll(".tick text")
        .attr("x", -100)
        .style("text-anchor", "end")
        .call(wrap, margin.left - 10)
        .attr("transform", "translate(-10, 0)");

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

      // Create legend for p.adjust values
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
      <svg
        id="ridgeChart"
        className="ridgechart"
        ref={svgRef}
        style={{ width: "100%", height: "auto" }} // Optional for responsive design
      ></svg>
      <div id="tooltip" className="tooltip" style={{ display: "none" }}></div>
    </div>
  );
};

export default RidgePlotComponent;
