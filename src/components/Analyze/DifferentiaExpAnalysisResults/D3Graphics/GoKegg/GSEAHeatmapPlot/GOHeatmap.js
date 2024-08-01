import "../../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { fetchDataFile } from "../../../utils";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

const GOHeatmapComponent = ({ tableData, allData }) => {
  const svgRef = useRef();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [activeTab, setActiveTab] = useState("All Samples");

  const margin = { top: 20, right: 30, bottom: 150, left: 150 };
  const width = 900 - margin.left - margin.right;
  const height = 950 - margin.top - margin.bottom;

  const cleanData = (data) => {
    return data.map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replace(/^"|"$/g, ""); // Adjust regex to remove only leading and trailing quotes
      }
      return cleanedData;
    });
  };

  useEffect(() => {
    try {
      setData1(cleanData(tableData.slice(0, 25)));
      setData2(cleanData(allData));
    } catch (error) {
      console.error("Incorrect File:", error);
    }
  }, [tableData, allData]);

  useEffect(() => {
    if (data1.length > 0 && data2.length > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const plot = svg
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const proteins = Array.from(new Set(data2.map((d) => d["Protein"])));
      const Descriptions = Array.from(
        new Set(data1.map((d) => d["Description"]))
      );

      const proteinFoldChange = {};
      data2.forEach((d) => {
        const protein = d["Protein"];
        const foldChange = parseFloat(d["Fold.Change"]);
        proteinFoldChange[protein] = foldChange;
      });

      const heatmapData = data1.flatMap((d) => {
        const proteins = d["core_enrichment"].split("/");
        return proteins.map((protein) => ({
          ...d,
          Protein: protein,
          "Fold.Change": proteinFoldChange[protein] || 0,
        }));
      });

      const validData = heatmapData.filter((d) => !isNaN(d["Fold.Change"]));

      let filteredProteins = proteins;

      let finalValidData = validData;
      if (activeTab === "Compressed graph") {
        filteredProteins = new Set(
          validData.filter((d) => d["Protein"]).map((d) => d["Protein"])
        );
        finalValidData = validData.filter((d) =>
          filteredProteins.has(d["Protein"])
        );
      }

      const colorScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain(d3.extent(data2, (d) => +d["Fold.Change"]));

      const xScale = d3
        .scaleBand()
        .domain(Array.from(filteredProteins))
        .range([0, width])
        .padding(0.05);

      const yScale = d3
        .scaleBand()
        .domain(Descriptions)
        .range([height, 0])
        .padding(0.05);

      // Append grid lines
      plot
        .append("g")
        .attr("class", "grid")
        .selectAll("line")
        .data(xScale.domain())
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(d))
        .attr("x2", (d) => xScale(d))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#e0e0e0");

      plot
        .append("g")
        .attr("class", "grid")
        .selectAll("line")
        .data(yScale.domain())
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))
        .attr("stroke", "#e0e0e0");

      plot
        .selectAll(".tile")
        .data(finalValidData)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", (d) => xScale(d["Protein"]))
        .attr("y", (d) => yScale(d["Description"]))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(d["Fold.Change"]))
        .on("mouseover", function (event, d) {
          const [x, y] = d3.pointer(event);
          d3.select("#tooltip")
            .style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(
              `<strong>Protein:</strong> ${d["Protein"]}<br>` +
                `<strong>Description:</strong> ${
                  d["Description"] || "N/A"
                }<br>` +
                `<strong>Fold Change:</strong> ${d["Fold.Change"]}`
            );
        })
        .on("mouseout", function () {
          d3.select("#tooltip").style("display", "none");
        });

      plot
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll(".tick text")
        .attr("transform", "rotate(-90)")
        .attr("x", -5)
        .attr("dy", "0.32em")
        .style("text-anchor", "end");

      plot
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll(".tick text")
        .attr("x", -5)
        .style("text-anchor", "end")
        .call(wrap, margin.left - 10)
        .attr("transform", "translate(-10, 0)");

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 40})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Protein");

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
          `translate(${(width - legendWidth) / 2}, ${
            height + margin.top + 100
          })`
        );

      const legendScale = d3
        .scaleLinear()
        .domain(colorScale.domain())
        .range([0, legendWidth]);

      const legendAxis = d3
        .axisBottom(legendScale)
        .ticks(5)
        .tickSize(-legendHeight);

      legend
        .selectAll("rect")
        .data(colorScale.ticks(legendWidth))
        .enter()
        .append("rect")
        .attr("x", (d) => legendScale(d))
        .attr("y", 0)
        .attr("width", legendWidth / colorScale.ticks(legendWidth).length)
        .attr("height", legendHeight)
        .attr("fill", (d) => colorScale(d));

      legend
        .append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("stroke", "#d0d0d0")
            .attr("stroke-dasharray", "2,2")
        );

      plot
        .append("g")
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 90})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Fold Change");
    }
  }, [data1, data2, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  function wrap(text, width) {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", `${dy}em`);
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
            .attr("dy", `${++lineNumber * lineHeight + dy}em`)
            .text(word);
        }
      }
    });
  }

  return (
    <div className="heatmap-container">
      <div className="tabs">
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          sx={{
            backgroundColor: "#EBEBEB",
            borderRadius: "16px",
            "& .MuiToggleButtonGroup-grouped": {
              margin: "7px 5px",
              border: "none",
              padding: "5px 10px",
              fontFamily: "Montserrat",
              borderRadius: "16px !important",
              "&.Mui-selected": {
                backgroundColor: "#1463B9",
                color: "white",
                "&:hover": {
                  backgroundColor: "#6B9AC4",
                },
              },
              "&:not(.Mui-selected)": {
                color: "#1463B9",
                "&:hover": {
                  backgroundColor: "#BBD1E9",
                },
              },
            },
          }}
        >
          <ToggleButton
            value="All Samples"
            onClick={() => handleTabClick("All Samples")}
          >
            All Samples
          </ToggleButton>
          <ToggleButton
            value="Compressed graph"
            onClick={() => handleTabClick("Compressed graph")}
          >
            Compressed graph
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <svg
        ref={svgRef}
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      ></svg>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default GOHeatmapComponent;
