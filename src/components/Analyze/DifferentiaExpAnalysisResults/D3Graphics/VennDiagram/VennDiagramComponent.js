import "../D3GraphStyles.css";
import React, { useEffect, useState } from "react";
import * as d3 from "d3v7";
import { VennDiagram } from "venn.js";
import { fetchCSV } from "../../utils.js"; // Import fetchCSV from utils.js

const VennDiagramComponent = ({ jobId }) => {
  const [data, setData] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await fetchCSV(jobId, "data_original.csv");
        console.log("Fetched CSV Data:", csvData); // Log fetched CSV data
        setData(csvData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jobId]);

  useEffect(() => {
    if (!data) return;

    const graphData = data.data;
    const labels = graphData[0];
    const df = graphData.slice(1);

    const groups = getGroupLabels(labels);
    console.log("Groups:", groups); // Log extracted groups

    const [a_columns, b_columns] = getGroupColumns(labels, groups);
    console.log("Columns for", groups[0], ":", a_columns); // Log columns for group A
    console.log("Columns for", groups[1], ":", b_columns); // Log columns for group B

    const { unique_a, unique_b, common_ab } = calculateSets(
      df,
      a_columns,
      b_columns
    );
    console.log("Unique Set A:", unique_a); // Log unique set A
    console.log("Unique Set B:", unique_b); // Log unique set B
    console.log("Common Set AB:", common_ab); // Log common set AB

    const vennContainer = d3.select("#venn");
    vennContainer.selectAll("*").remove(); // Clear any existing diagram

    const sets = [
      {
        sets: [`${groups[0]}`],
        size: unique_a.size,
        label: `Unique ${groups[0]} (${unique_a.size})`,
        data: unique_a,
      },
      {
        sets: [`${groups[1]}`],
        size: unique_b.size,
        label: `Unique ${groups[1]} (${unique_b.size})`,
        data: unique_b,
      },
      {
        sets: [`${groups[0]}`, `${groups[1]}`],
        size: common_ab.size,
        label: `Common ${groups[0]} & ${groups[1]} (${common_ab.size})`,
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
    return uniqueVals.filter((val) => val !== '"Label"');
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
      .attr("viewBox", "0 0 600 500");

    svg
      .append("circle")
      .attr("cx", 250)
      .attr("cy", 250)
      .attr("r", 200)
      .style("fill", "lightgrey")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", function () {
        d3.select(this).style("fill-opacity", 0.5);
        venntooltip.html(
          `Unique ${groups[0]}<br>Size: ${unique_a.size}<br>` +
            `Unique ${groups[1]}<br>Size: ${unique_b.size}<br>` +
            `Common ${groups[0]} & ${groups[1]}<br>Size: ${common_ab.size}`
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
      .style("font-size", "18px")
      .text("Coincidental");

    const groupInfo = vennContainer
      .append("div")
      .attr("class", "group-info-special");

    groupInfo.append("p").html(`Unique ${groups[0]}: ${unique_a.size}`);
    groupInfo.append("p").html(`Unique ${groups[1]}: ${unique_b.size}`);
    groupInfo
      .append("p")
      .html(`Common ${groups[0]} & ${groups[1]}: ${common_ab.size}`);
  };

  const drawStandardVenn = (vennContainer, sets, groups, venntooltip) => {
    const chart = VennDiagram();
    vennContainer.datum(sets).call(chart);

    vennContainer
      .selectAll(".venn-circle path")
      .style("stroke-width", 2)
      .style("stroke", "black");

    vennContainer
      .selectAll(".venn-circle text")
      .html((d) => `${d.label}`)
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .style("fill", "black")
      .attr("dx", (d) => {
        // Adjust text offset from the center
        return 5; // Adjust as needed
      })
      .attr("dy", (d) => {
        return -25; // Adjust as needed
      });

    vennContainer
      .selectAll(".venn-area")
      .on("mouseover", function (event, d) {
        d3.select(this).select("path").style("fill-opacity", 0.5);
        venntooltip.html(
          `Set: ${d.label.split("(")[0].trim()}<br>Size: ${d.size}`
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

    const groupInfo = vennContainer.append("div").attr("class", "group-info");

    groupInfo.append("p").html(`Unique ${groups[0]}: ${sets[0].size}`);
    groupInfo.append("p").html(`Unique ${groups[1]}: ${sets[1].size}`);
    groupInfo
      .append("p")
      .html(`Common ${groups[0]} & ${groups[1]}: ${sets[2].size}`);
  };

  return (
    <div id="vennContainer">
      <div id="venn"></div>
      {selectedSet && (
        <div>
          <h2>{selectedSet.label}</h2>
          <table className="protein-table">
            <thead>
              <tr>
                <th>Protein</th>
              </tr>
            </thead>
            <tbody>
              {[...selectedSet.data].map((protein, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={`https://salivaryproteome.org/protein/${protein}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {protein}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VennDiagramComponent;
