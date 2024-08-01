import "../D3GraphStyles.css";
import React, { useEffect, useState } from "react";
import * as d3 from "d3v7";
import { VennDiagram } from "venn.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

const VennDiagramComponent = ({ data }) => {
  const [selectedSet, setSelectedSet] = useState(null);

  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  useEffect(() => {
    if (!data) return;

    const graphData = data;
    const labels = graphData[0];
    const df = graphData.slice(1);

    const groups = getGroupLabels(labels);
    const [a_columns, b_columns] = getGroupColumns(labels, groups);

    const { unique_a, unique_b, common_ab } = calculateSets(
      df,
      a_columns,
      b_columns
    );

    const vennContainer = d3.select("#venn");
    vennContainer.selectAll("*").remove(); // Clear any existing diagram

    const sets = [
      {
        sets: [`${groups[0]}`],
        size: unique_a.size,
        label: `${groups[0].replace(/['"]+/g, "")} (${unique_a.size})`,
        data: unique_a,
      },
      {
        sets: [`${groups[1]}`],
        size: unique_b.size,
        label: `${groups[1].replace(/['"]+/g, "")} (${unique_b.size})`,
        data: unique_b,
      },
      {
        sets: [`${groups[0]}`, `${groups[1]}`],
        size: common_ab.size,
        label: `Common (${common_ab.size})`,
        data: common_ab,
      },
    ];

    const venntooltip = initializeTooltip();

    if (unique_a.size === 0 && unique_b.size === 0 && common_ab.size > 0) {
      drawSpecialCaseVenn(
        vennContainer,
        sets,
        groups,
        common_ab,
        unique_a,
        unique_b,
        venntooltip
      );
    } else {
      drawStandardVenn(vennContainer, sets, groups, venntooltip);
    }
  }, [data]);

  const getGroupLabels = (labelData) => {
    const uniqueVals = [...new Set(Object.values(labelData))];
    return uniqueVals.filter((val) => val !== "Label");
  };

  const getGroupColumns = (labels, groups) => [
    Object.keys(labels).filter((key) => labels[key] === groups[0]),
    Object.keys(labels).filter((key) => labels[key] === groups[1]),
  ];

  const calculateSets = (df, a_columns, b_columns) => {
    const unique_a = new Set();
    const unique_b = new Set();
    const common_ab = new Set();

    df.forEach((row) => {
      const label = getLabelFromRow(row);
      const is_a_zero = a_columns.every(
        (col) => parseFloat(stripQuotes(row[col])) === 0.0
      );
      const is_b_zero = b_columns.every(
        (col) => parseFloat(stripQuotes(row[col])) === 0.0
      );

      if (is_a_zero && !is_b_zero) {
        unique_b.add(label);
      } else if (!is_a_zero && is_b_zero) {
        unique_a.add(label);
      } else if (!is_a_zero && !is_b_zero) {
        common_ab.add(label);
      }
    });

    return { unique_a, unique_b, common_ab };
  };

  const getLabelFromRow = (row) => stripQuotes(row["Protein"]);

  const stripQuotes = (value) => value.replace(/^"(.*)"$/, "$1");

  const initializeTooltip = () =>
    d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute");

  const drawSpecialCaseVenn = (
    vennContainer,
    sets,
    groups,
    common_ab,
    unique_a,
    unique_b,
    venntooltip
  ) => {
    const svg = vennContainer
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

    svg
      .append("circle")
      .attr("cx", 250)
      .attr("cy", 250)
      .attr("r", 188)
      .style("fill", "lightgrey")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", function () {
        d3.select(this).style("fill-opacity", 0.5);
        venntooltip.html(
          `<strong>Unique ${groups[0]}</strong><br><strong>Size:</strong> ${unique_a.size}<br>` +
            `<strong>Unique ${groups[1]}</strong><br><strong>Size:</strong> ${unique_b.size}<br>` +
            `<strong>Common ${groups[0]} & ${groups[1]}</strong><br><strong>Size:</strong> ${common_ab.size}`
        );
        venntooltip.style("visibility", "visible");
      })
      .on("mousemove", function (event) {
        venntooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill-opacity", null);
        venntooltip.style("visibility", "hidden");
      })
      .on("click", function () {
        setSelectedSet(sets[2]); // Set selected set to state (common_ab)
      });

    svg
      .append("text")
      .attr("x", 250)
      .attr("y", 250)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      .text("Coincidental");

    //Display group information and colored circles as legends in upper right corner
    function createLegend(selection, legendDict) {
      const legend = selection
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(25, 40)");

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
        .attr("transform", (d, i) => `translate(0,${i * 40})`);

      legendItem
        .append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 10)
        .attr("fill", (d) => d.color);

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .attr("transform", `translate(8, 6)`)
        .text((d) => `${d.label}: ${sets[0].size}`);
    }
    createLegend(svg, {
      1: [`Unique ${groups[0]}`, "#1f77b4"],
      2: ["B", "Gray"],
    });
  };

  const drawStandardVenn = (vennContainer, sets, groups, venntooltip) => {
    const svg = vennContainer
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

    const chart = VennDiagram().width(width).height(height);
    svg.datum(sets).call(chart);

    svg
      .selectAll(".venn-circle path")
      .style("stroke-width", 2)
      .style("stroke", "black");

    svg
      .selectAll(".venn-circle text")
      .html((d, i) => `${sets[i].label}`)
      .style("font-weight", "bold")
      .style("font-size", "15px") // Ensure this is set to 15px
      .style("fill", "black")
      .attr("dx", (d) => {
        return 5; // Adjust as needed
      })
      .attr("dy", (d) => {
        return -32; // Adjust as needed
      });

    // Event handlers for .venn-area elements
    svg
      .selectAll(".venn-area")
      .on("mouseover", function (event, d) {
        d3.select(this).select("path").style("fill-opacity", 0.5);
        venntooltip.html(
          `<strong>Set:</strong> ${d.label
            .split("(")[0]
            .trim()}<br><strong>Size:</strong> ${d.size}`
        );
        venntooltip.style("visibility", "visible");
      })

      .on("mousemove", function (event) {
        venntooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).select("path").style("fill-opacity", 0.25);
        venntooltip.style("visibility", "hidden");
      })
      .on("click", function (event, d) {
        setSelectedSet(d); // Set selected set to state
      });
  };

  return (
    <div id="vennContainer">
      <div id="venn" className="graph-container"></div>
      {selectedSet && (
        <div>
          <h2>
            {selectedSet.label.startsWith("Common")
              ? `${selectedSet.label}`
              : `Unique ${selectedSet.label}`}
          </h2>
          <div className="ag-theme-material ag-cell-wrap-text ag-theme-alpine">
            <AgGridReact
              // style="overflow-x: hidden;"
              className="ag-cell-wrap-text"
              rowData={[...selectedSet.data].map((protein) => ({
                protein,
                link: `https://salivaryproteome.org/protein/${protein}`,
              }))}
              columnDefs={[
                {
                  headerName: "Protein",
                  field: "protein",
                  cellRenderer: (params) => (
                    <a
                      href={params.data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {params.value}
                    </a>
                  ),
                  flex: 1,
                },
              ]}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VennDiagramComponent;
