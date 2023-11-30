import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TwoSidedBarChart = (props) => {
  const mapScoreToValue = (score) => {
    switch (score) {
      case "Low":
        return 1;
      case "Medium":
        return 2;
      case "High":
        return 3;
      default:
        return 0; // Handle other cases or undefined scores
    }
  };
  const chartRef = useRef(null);
  var color = d3
    .scaleOrdinal()
    .range([
      "#3182BD",
      "#6BAED6",
      "#9ECAE1",
      "#C6DBEF",
      "#E6550D",
      "#FD8D3C",
      "#FDAE65",
      "#FDD0A2",
      "#31A354",
      "#74C476",
      "#A1D99B",
      "#C7E9C0",
      "#756BB1",
      "#9E9AC8",
      "#BCBDDC",
      "#636363",
      "#969696",
      "#BDBDBD",
      "#D9D9D9",
    ]);
  var canvasWidth = 920;
  var barsWidthTotal = 350;
  var barHeight = 15;
  var svgTopOffset = 30;
  var barsHeightTotal = barHeight * props.data.length;
  var canvasHeight = props.data.length * barHeight + svgTopOffset + 20; // +10 puts a little space at bottom.
  var legendOffset = barHeight / 2;
  var legendBulletOffset = 80;
  var legendTextOffset = 20;
  var ihBarOffset = 90;
  useEffect(() => {
    var synchronizedMouseOver = function () {
      var bar = d3.select(this);
      var indexValue = bar.attr("index_value");

      var barSelector = "." + "bars-" + "-bar-" + indexValue;
      var selectedBar = d3.selectAll(barSelector);
      selectedBar.style("fill", "Maroon");

      //var bulletSelector = "." + "bars-" + chartID + "-legendBullet-" + indexValue;
      //var selectedLegendBullet = d3.selectAll(bulletSelector);
      //selectedLegendBullet.style("fill", "Maroon");

      var textSelector = "." + "bars-" + "-legendText-" + indexValue;
      var selectedLegendText = d3.selectAll(textSelector);
      selectedLegendText.style("fill", "Maroon");
    };

    var synchronizedMouseOut = function () {
      var bar = d3.select(this);
      var indexValue = bar.attr("index_value");

      var barSelector = "." + "bars-" + "-bar-" + indexValue;
      var selectedBar = d3.selectAll(barSelector);
      var colorValue = selectedBar.attr("color_value");
      selectedBar.style("fill", colorValue);

      //var bulletSelector = "." + "bars-" + chartID + "-legendBullet-" + indexValue;
      //var selectedLegendBullet = d3.selectAll(bulletSelector);
      //var colorValue = selectedLegendBullet.attr("color_value");
      //selectedLegendBullet.style("fill", colorValue);

      var textSelector = "." + "bars-" + "-legendText-" + indexValue;
      var selectedLegendText = d3.selectAll(textSelector);
      selectedLegendText.style("fill", "Black");
    };

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right + 800;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", canvasWidth)
      .attr("height", canvasHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = [
      {
        name: "Duodenum",
        left: -200.6,
        right: 1,
        gene: "ENSG00000211895",
        id: "IGHA1",
      },
      {
        name: "Colon",
        left: -41.7,
        right: 2,
        gene: "ENSG00000211895",
        id: "IGHA1",
      },
      {
        name: "Adipose tissue",
        left: -918.5,
        right: 3,
        gene: "ENSG00000211895",
        id: "IGHA1",
      },
      {
        name: "Appendix",
        left: -953.5,
        right: 0,
        gene: "ENSG00000211895",
        id: "IGHA1",
      },
      {
        name: "Lung",
        left: -5973.5,
        right: 1,
        gene: "ENSG00000211895",
        id: "IGHA1",
      },
      {
        name: "Liver",
        left: -7111.2,
        right: 0,
        gene: "ENSG00000211895",
        id: "IGHA1",
      },
    ];
    var maxV = Math.max.apply(
      Math,
      props.data.map(function (o) {
        if (o.nx.includes("?")) {
          return 0;
        } else {
          return Math.abs(parseInt(o.nx));
        }
      })
    );
    var maxMappedScore = Math.max.apply(
      Math,
      props.data.map(function (o) {
        return mapScoreToValue(o.score);
      })
    );

    const x = d3.scaleLinear().range([0, width + 100]);
    var x1 = d3
      .scaleLinear()
      .domain([-0.1, maxV])
      .rangeRound([0, barsWidthTotal - 50]);
    var x2 = d3
      .scaleLinear()
      .domain([0, maxMappedScore])
      .rangeRound([0, barsWidthTotal]);
    var y1 = d3
      .scaleLinear()
      .domain([0, props.data.length])
      .range([svgTopOffset, svgTopOffset + barsHeightTotal]);
    var y = d3
      .scaleLinear()
      .domain([0, props.data.length])
      .range([svgTopOffset, svgTopOffset + barsHeightTotal]);

    x.domain([
      d3.min(data, (d) => (d.left < 0 ? d.left : 0)),
      d3.max(data, (d) => (d.right > 0 ? d.right : 0)),
    ]);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`);

    svg
      .append("svg:text")
      .attr("x", barsWidthTotal / 2)
      .attr("y", 0)
      .attr("dy", svgTopOffset / 2) // vertical-align: middle
      .attr("text-anchor", "middle") // text-align: center
      .attr("font-size", "11px") // font-size: small
      .attr("font-weight", "bold")
      .text("RNA Expression (NX)")
      .attr("fill", "Black");

    svg
      .append("svg:text")
      .attr(
        "x",
        barsWidthTotal +
          legendBulletOffset +
          legendTextOffset +
          ihBarOffset +
          barsWidthTotal / 1.5
      )
      .attr("y", 0)
      .attr("dy", svgTopOffset / 2) // vertical-align: middle
      .attr("text-anchor", "middle") // text-align: center
      .attr("font-size", "11px") // font-size: small
      .attr("font-weight", "bold")
      .text("Protein Localization (score)")
      .attr("fill", "Black");

    svg
      .selectAll(".left-bar")
      .data(props.data)
      .enter()
      .append("rect")
      .attr("class", "left-bar")
      .attr("x", (d) => barsWidthTotal - x1(d.nx))
      .attr("y", (d, i) => y(i))
      .attr("width", (d) => {
        if (d.nx.includes("?")) {
          return 0;
        } else {
          return x1(d.nx);
        }
      })
      .attr("height", 15)
      .style("fill", (d) => {
        if (d.nx.includes("?")) {
          return color(0);
        } else {
          return color(parseInt(d.nx) % 20);
        }
      })
      .on("click", function (d) {
        window.open(
          "https://www.proteinatlas.org/" +
            props.gene_id +
            "/tissue/" +
            d.tissue
        );
      })
      .style("stroke", "white")
      .on("mouseover", function () {
        d3.select(this).select("rect").style("fill", "red");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).select("rect").style("fill", "blue");
      });

    svg
      .selectAll(".right-bar")
      .data(props.data)
      .enter()
      .append("svg:a")
      .append("rect")
      .attr("class", "right-bar")
      .attr(
        "x",
        barsWidthTotal + legendBulletOffset + legendTextOffset + ihBarOffset
      )
      .attr("y", (d, i) => {
        return y(i);
      })
      .attr("index_value", function (d, i) {
        return "index-" + i;
      })
      .attr("height", barHeight)
      .attr("width", function (d) {
        return d.score ? x2(mapScoreToValue(d.score)) : 0;
      })
      .style("fill", "White")
      .style("fill", (d) => {
        return d.score ? color(mapScoreToValue(d.score)) : color(0);
      })
      .on("click", function (d) {
        window.open(
          "https://www.proteinatlas.org/" +
            props.gene_id +
            "/tissue/" +
            d.tissue
        );
      })
      .style("stroke", "white")
      .on("mouseover", function () {
        d3.select(this).select("rect").style("fill", "red");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).select("rect").style("fill", "blue");
      });

    svg
      .selectAll(".text")
      .data(props.data)
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("text-anchor", "middle")
      .attr("x", barsWidthTotal + legendBulletOffset + legendTextOffset)
      .attr("y", (d, i) => svgTopOffset + legendOffset + i * barHeight)
      .attr("dy", ".20em")
      .attr("font-weight", "normal")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text((d) => d.tissue)
      .on("mouseover", function () {
        d3.select(this).select("rect").style("fill", "red");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).select("rect").style("fill", "blue");
      })
      .on("click", function (d) {
        window.open(
          "https://www.proteinatlas.org/" +
            props.gene_id +
            "/tissue/" +
            d.tissue
        );
      });

    svg
      .selectAll(".text-left")
      .data(props.data)
      .enter()
      .append("text")
      .attr("class", "text-left")
      .attr("x", (d) => {
        if (d.nx.includes("?")) {
          return 0;
        } else {
          return -x1(parseInt(d.nx)) - 8;
        }
      })
      .attr("y", (d, i) => y(i))
      .attr("dx", (d) => barsWidthTotal)
      .attr("font-size", "10px")
      .attr("dy", barHeight - 5)
      .attr("text-anchor", "end")
      .text((d) => {
        if (d.nx.includes("?")) {
          return 0;
        } else {
          return d.nx;
        }
      })
      .attr("fill", "Black");

    svg
      .selectAll(".text-right")
      .data(props.data)
      .enter()
      .filter((d) => d.score) // Filter out data with empty "score" values
      .append("text")
      .attr("class", "text-right")
      .attr(
        "x",
        (d) =>
          barsWidthTotal +
          legendBulletOffset +
          legendTextOffset +
          ihBarOffset +
          x2(mapScoreToValue(d.score)) +
          5
      )
      .attr("y", (d, i) => y(i))
      .attr("dx", 5)
      .attr("dy", barHeight - 5)
      .attr("font-size", "10px")
      .attr("text-anchor", "start")
      .text((d) => d.score)
      .attr("fill", "Black");
  }, []);

  return <div ref={chartRef}></div>;
};

export default TwoSidedBarChart;
