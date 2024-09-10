import "../D3GraphStyles.css";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3v7";
import { fetchDataFile } from "../../utils.js"; // Import fetchDataFile from utils.js

const Boxplot = ({ containerId, data }) => {
  const boxplotRef = useRef(null);
  const [topN, setTopN] = useState(30); // State to manage the number of top boxplots
  // const [data, setData] = useState(null);

  useEffect(() => {
    if (!data) return;

    // Clear existing SVG elements inside the container
    d3.select(boxplotRef.current).selectAll("*").remove();

    // Boxplot setup
    const boxMargin = { top: 40, right: 14, bottom: 40, left: 80 };
    let boxWidth = 500 - boxMargin.left - boxMargin.right;
    let boxHeight = 950 - boxMargin.top - boxMargin.bottom;

    // Parse data
    const labels = Object.keys(data[0]);
    const boxValues = data.map((d) =>
      labels.slice(1).map((key) => parseFloat(d[key].replace(/"/g, "")))
    );
    const sumstats = boxValues.map((rowValues, i) => {
      const sortedValues = rowValues.sort(d3.ascending);
      const q1 = d3.quantile(sortedValues, 0.25);
      const median = d3.quantile(sortedValues, 0.5);
      const q3 = d3.quantile(sortedValues, 0.75);
      const interQuantileRange = q3 - q1;
      const min = q1 - 1.5 * interQuantileRange;
      const max = q3 + 1.5 * interQuantileRange;
      const outliers = sortedValues.filter((v) => v < min || v > max);
      return {
        label: data[i]["Protein"].replace(/"/g, ""),
        q1,
        median,
        q3,
        min,
        max,
        iqr: interQuantileRange,
        outliers,
        values: rowValues,
      };
    });

    // Sort the sumstats by median value in descending order and take the top N
    sumstats.sort((a, b) => b.median - a.median);
    const topSumstats = sumstats.slice(1, topN + 1);
    const topLabels = topSumstats.map((d) => d.label);
    const allValues = topSumstats.flatMap((d) => d.values);
    // Calculate dynamic padding
    const minValue = d3.min(allValues);
    const maxValue = d3.max(allValues);
    const range = maxValue - minValue;
    const padding = range * 1.2; // 120% padding

    // Dynamically adjust xMin and xMax
    const xMin = minValue - padding;
    const xMax = maxValue + padding;

    const boxSvg = d3
      .select(boxplotRef.current)
      .append("svg")
      .attr("class", "box-plot")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",

        `0 0 ${boxWidth + boxMargin.left + boxMargin.right} ${
          boxHeight + boxMargin.top + boxMargin.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${boxMargin.left},${boxMargin.top})`);

    const y = d3
      .scaleBand()
      .domain(topLabels)
      .range([0, boxHeight])
      .paddingInner(1)
      .paddingOuter(0.7);

    const xScaleBox = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([0, boxWidth]);

    const xAxisBox = boxSvg
      .append("g")
      .attr("transform", `translate(0,${boxHeight})`)
      .call(d3.axisBottom(xScaleBox));

    const yAxisBox = boxSvg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "10px");

    const boxTooltip = d3.select("body").append("div").attr("class", "tooltip");

    const showBoxTooltip = function (event, d) {
      boxTooltip
        .style("opacity", 1)
        .html(
          `<strong>Label:</strong> ${d.label}<br>` +
            `<strong>Q1:</strong> ${d.q1}<br>` +
            `<strong>Median:</strong> ${d.median}<br>` +
            `<strong>Q3:</strong> ${d.q3}<br>` +
            `<strong>IQR:</strong> ${d.iqr}<br>` +
            `<strong>Min:</strong> ${d.min}<br>` +
            `<strong>Max:</strong> ${d.max}<br>` +
            `<strong>Outliers:</strong> ${d.outliers.length}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    };

    const hideBoxTooltip = function () {
      boxTooltip.style("opacity", 0);
    };

    // Define clip path
    boxSvg
      .append("clipPath")
      .attr("id", "boxplot-clip")
      .append("rect")
      .attr("width", boxWidth)
      .attr("height", boxHeight + boxMargin.top + boxMargin.bottom)
      .attr("x", 0)
      .attr("y", -boxMargin.top);

    const boxes = boxSvg
      .selectAll(".boxplot")
      .data(topSumstats)
      .enter()
      .append("g")
      .attr("clip-path", "url(#boxplot-clip)")
      .attr("class", "boxplot")
      .attr("transform", (d) => `translate(0,${y(d.label)})`);

    boxes.each(function (d) {
      const g = d3.select(this);

      g.append("line")
        .attr("class", "whisker")
        .attr("x1", xScaleBox(d.min))
        .attr("y1", 0)
        .attr("x2", xScaleBox(d.max))
        .attr("y2", 0);

      g.append("rect")
        .attr("class", "box")
        .attr("x", xScaleBox(d.q1))
        .attr("y", -10)
        .attr("width", xScaleBox(d.q3) - xScaleBox(d.q1))
        .attr("height", 20)
        .style("fill", "#69b3a2");

      g.append("line")
        .attr("class", "median")
        .attr("x1", xScaleBox(d.median))
        .attr("y1", -10)
        .attr("x2", xScaleBox(d.median))
        .attr("y2", 10);

      g.append("line")
        .attr("class", "min-line")
        .attr("x1", xScaleBox(d.min))
        .attr("y1", -10)
        .attr("x2", xScaleBox(d.min))
        .attr("y2", 10);

      g.append("line")
        .attr("class", "max-line")
        .attr("x1", xScaleBox(d.max))
        .attr("y1", -10)
        .attr("x2", xScaleBox(d.max))
        .attr("y2", 10);

      const outliers = g
        .selectAll(".outlier")
        .data(d.outliers)
        .enter()
        .append("circle")
        .attr("class", "outlier")
        .attr("cx", (v) => xScaleBox(v))
        .attr("cy", 0)
        .attr("r", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

      g.on("mouseover", function (event, d) {
        showBoxTooltip(event, d);
        d3.select(this)
          .select(".box")
          .style("fill", "#ff9900")
          .attr("height", 30)
          .attr("y", -15);
        d3.select(this)
          .selectAll(".min-line, .max-line")
          .style("stroke", "#ff9900")
          .attr("stroke-width", 3);
        outliers.attr("fill", "#ff9900").attr("r", 5);
      })
        .on("mousemove", (event, d) => showBoxTooltip(event, d))
        .on("mouseleave", function () {
          hideBoxTooltip();
          d3.select(this)
            .select(".box")
            .style("fill", "#69b3a2")
            .attr("height", 20)
            .attr("y", -10);
          d3.select(this)
            .selectAll(".min-line, .max-line")
            .style("stroke", "black")
            .attr("stroke-width", 1.5);
          outliers.attr("fill", "white").attr("r", 3);
        });

      g.append("text")
        .attr("class", "label")
        .attr("x", -10)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text(d.label);
    });

    const zoom = d3.zoom().scaleExtent([1, 100]).on("zoom", zoomed);

    boxSvg.call(zoom);

    function zoomed(event) {
      const newX = event.transform.rescaleX(xScaleBox);
      xAxisBox.call(d3.axisBottom(newX));

      boxes.attr("transform", (d) => `translate(0,${y(d.label)})`);
      boxes
        .selectAll(".whisker")
        .attr("x1", (d) => newX(d.min))
        .attr("x2", (d) => newX(d.max));
      boxes
        .selectAll(".box")
        .attr("x", (d) => newX(d.q1))
        .attr("width", (d) => newX(d.q3) - newX(d.q1));
      boxes
        .selectAll(".median")
        .attr("x1", (d) => newX(d.median))
        .attr("x2", (d) => newX(d.median));
      boxes
        .selectAll(".min-line")
        .attr("x1", (d) => newX(d.min))
        .attr("x2", (d) => newX(d.min));
      boxes
        .selectAll(".max-line")
        .attr("x1", (d) => newX(d.max))
        .attr("x2", (d) => newX(d.max));
      boxes.selectAll(".outlier").attr("cx", (d) => newX(d));
    }
  }, [data, topN]);

  const handleTopNChange = (event) => {
    const value = parseInt(event.target.value, 10);

    if (!isNaN(value) && value >= 1 && value <= 41) {
      setTopN(value);
    }
  };

  return (
    <div>
      <label htmlFor="topN" className="input-label">
        Number of Proteins (1 - 40):
      </label>
      <input
        type="number"
        id="topN"
        name="topN"
        value={topN}
        onChange={handleTopNChange}
        min={1}
        max={40}
        className="input-number"
      />
      <div
        id={containerId}
        className="box-plot graph-container"
        ref={boxplotRef}
      />
    </div>
  );
};

export default Boxplot;
