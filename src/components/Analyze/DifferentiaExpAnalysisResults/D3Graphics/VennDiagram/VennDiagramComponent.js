import "../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";
import { VennDiagram } from "venn.js";
import { AgGridReact } from "ag-grid-react";
import DataTable from "../../DataTable";
import { createLegend } from "../../utils";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

/**
 * VennDiagramComponent renders a Venn diagram based on the provided data.
 * @param {Object} props - The component props.
 * @param {Array} props.data - The data to be used for rendering the Venn diagram.
 * @returns {JSX.Element} The rendered VennDiagramComponent.
 */
const VennDiagramComponent = ({ data }) => {
  const svgRef = useRef(); // Ref for the SVG element
  const [selectedSet, setSelectedSet] = useState(null);

  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 40, bottom: 20, left: 20 };

  /**
   * useEffect hook to initialize and update the Venn diagram when data changes.
   */
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

    const vennContainer = d3.select(svgRef.current);
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

  /**
   * Extracts unique group labels from the provided label data.
   * @param {Object} labelData - The label data.
   * @returns {Array} The unique group labels.
   */
  const getGroupLabels = (labelData) => {
    const uniqueVals = [...new Set(Object.values(labelData))];
    return uniqueVals.filter((val) => val !== "Label");
  };

  /**
   * Determines the columns corresponding to each group.
   * @param {Object} labels - The labels object.
   * @param {Array} groups - The group labels.
   * @returns {Array} An array containing the columns for each group.
   */
  const getGroupColumns = (labels, groups) => [
    Object.keys(labels).filter((key) => labels[key] === groups[0]),
    Object.keys(labels).filter((key) => labels[key] === groups[1]),
  ];

  /**
   * Calculates the unique and common sets based on the provided data and columns.
   * @param {Array} df - The data frame.
   * @param {Array} a_columns - The columns for group A.
   * @param {Array} b_columns - The columns for group B.
   * @returns {Object} The sets containing unique and common values.
   */
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

  /**
   * Extracts the label from a data row.
   * @param {Object} row - The data row.
   * @returns {string} The extracted label.
   */
  const getLabelFromRow = (row) => stripQuotes(row["Protein"]);

  /**
   * Removes quotes from a string value.
   * @param {string} value - The string value.
   * @returns {string} The value without quotes.
   */
  const stripQuotes = (value) => value.replace(/^"(.*)"$/, "$1");

  const initializeTooltip = () =>
    d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute");

  /**
   * Draws the Venn diagram for the special case where there are no unique sets.
   * @param {d3.Selection} vennContainer - The selection of the Venn diagram container.
   * @param {Array} sets - The sets to be displayed in the diagram.
   * @param {Array} groups - The group labels.
   * @param {Set} common_ab - The set of common values.
   * @param {Set} unique_a - The set of unique values for group A.
   * @param {Set} unique_b - The set of unique values for group B.
   * @param {d3.Selection} venntooltip - The tooltip selection.
   */
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
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", Math.min(width, height) / 2.5)
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
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      .text("Coincidental");

    createLegend(
      svg,
      {
        1: [`Unique ${groups[0]}: ${sets[0].size}`, "#1f77b4"],
        2: [`Unique ${groups[1]}: ${sets[1].size}`, "#ff7f0e"],
        3: [`Common ${groups[0]} & ${groups[1]}: ${sets[2].size}`, "grey"],
      },
      width - 3 * margin.right,
      40,
      12
    );
  };

  /**
   * Draws a standard Venn diagram with three sets.
   * @param {d3.Selection} vennContainer - The selection of the Venn diagram container.
   * @param {Array} sets - The sets to be displayed in the diagram.
   * @param {Array} groups - The group labels.
   * @param {d3.Selection} venntooltip - The tooltip selection.
   */
  const drawStandardVenn = (vennContainer, sets, groups, venntooltip) => {
    const svg = vennContainer
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
      .style("font-size", "15px")
      .style("fill", "black")
      .attr("dx", (d) => 5)
      .attr("dy", (d) => -32);

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
        setSelectedSet(d);
      });

    createLegend(
      svg,
      {
        1: [`Unique ${groups[0]}: ${sets[0].size}`, "#1f77b4"],
        2: [`Unique ${groups[1]}: ${sets[1].size}`, "#ff7f0e"],
        3: [`Common ${groups[0]} & ${groups[1]}: ${sets[2].size}`, "grey"],
      },
      width - 3 * margin.right,
      40,
      12
    );
  };
  /**
   * Renders the Venn diagram and the associated data table.
   * Displays the SVG element for the Venn diagram and, if a set is selected,
   * shows a data table with details of the selected set.
   *
   * @returns {JSX.Element} The rendered Venn diagram component.
   */
  return (
    <div id="vennContainer">
      {/* SVG element for rendering the Venn diagram */}
      <svg ref={svgRef} style={{ width: "90%", height: "auto" }}></svg>

      {/* Conditionally render the data table if a set is selected */}
      {selectedSet && (
        <div>
          {/* Heading for the selected set */}
          <h2>
            {selectedSet.label.startsWith("Common")
              ? `${selectedSet.label}`
              : `Unique ${selectedSet.label}`}
          </h2>

          {/* DataTable component displaying the data of the selected set */}
          <div className="ag-theme-material ag-cell-wrap-text ag-theme-alpine">
            <DataTable
              /**
               * Data to be displayed in the table. Each item in the array is an object with a `protein` property.
               * The `protein` values are links to external resources, such as detailed protein information.
               *
               * @type {Array<{protein: string}>}
               */
              data={[...selectedSet.data].map((protein) => ({
                protein,
              }))}
              hasCustomCells={true}
              customCells={[0]} // Specifies which columns have custom cell rendering
              cellRenderer={[
                /**
                 * Renders a custom cell with a link to the external resource.
                 * Each `protein` value is used to generate a URL for detailed information.
                 *
                 * @param {object} params - Parameters for the cell renderer.
                 * @param {string} params.value - The value to be displayed in the cell (protein name).
                 * @returns {JSX.Element} A link element with the protein name.
                 */
                (params) => (
                  <a
                    href={`https://salivaryproteome.org/protein/${params.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {params.value}
                  </a>
                ),
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VennDiagramComponent;
