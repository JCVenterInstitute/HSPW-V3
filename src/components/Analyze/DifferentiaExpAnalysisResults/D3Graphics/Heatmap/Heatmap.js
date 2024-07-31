// import "../D3GraphStyles.css";
// import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3v7";

// const HeatmapComponent = ({ jobId, fileName, numbVolcanoSamples, tab }) => {
//   const svgRef = useRef();
//   const [data, setData] = useState([]);

//   const margin = { top: 20, right: 30, bottom: 200, left: 135 };
//   const width = 1000 - margin.left - margin.right;
//   const height = 1050 - margin.top - margin.bottom;

//   const cleanData = (data) => {
//     return data.slice(1).map((d) => {
//       // Slice to remove the first row
//       const cleanedData = {};
//       for (let key in d) {
//         cleanedData[key] = d[key].replace(/^"|"$/g, ""); // Adjust regex to remove only leading and trailing quotes
//       }
//       return cleanedData;
//     });
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       let cleanedData = cleanData(fileName);
//       if (tab.startsWith("Top")) {
//         cleanedData = cleanedData.slice(0, numbVolcanoSamples);
//       }
//       setData(cleanedData);
//     };

//     loadData();
//   }, [jobId, fileName, tab]);

//   useEffect(() => {
//     if (data.length > 0) {
//       const svg = d3.select(svgRef.current);
//       svg.selectAll("*").remove();

//       const plot = svg
//         .attr("preserveAspectRatio", "xMinYMin meet")
//         .attr(
//           "viewBox",
//           `0 0 ${width + margin.left + margin.right} ${
//             height + margin.top + margin.bottom
//           }`
//         )
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//       // Extract unique labels and columns
//       const labels = data.map((d) => d["Protein"]);
//       const columns = Object.keys(data[0]).slice(1); // Ignore "Label"

//       const colorScale = d3
//         .scaleSequential(d3.interpolateRdBu)
//         .domain(d3.extent(data, (d) => +d[columns[0]]));

//       const xScale = d3
//         .scaleBand()
//         .domain(columns)
//         .range([0, width])
//         .padding(0.05);
//       const yScale = d3
//         .scaleBand()
//         .domain(labels)
//         .range([height, 0])
//         .padding(0.1);

//       // Append grid lines
//       plot
//         .append("g")
//         .attr("class", "grid")
//         .selectAll("line")
//         .data(xScale.domain())
//         .enter()
//         .append("line")
//         .attr("x1", (d) => xScale(d))
//         .attr("x2", (d) => xScale(d))
//         .attr("y1", 0)
//         .attr("y2", height)
//         .attr("stroke", "#e0e0e0");

//       plot
//         .append("g")
//         .attr("class", "grid")
//         .selectAll("line")
//         .data(yScale.domain())
//         .enter()
//         .append("line")
//         .attr("x1", 0)
//         .attr("x2", width)
//         .attr("y1", (d) => yScale(d))
//         .attr("y2", (d) => yScale(d))
//         .attr("stroke", "#e0e0e0");

//       // Flatten the data to create a suitable structure for the heatmap
//       const flattenedData = [];
//       data.forEach((d) => {
//         columns.forEach((column) => {
//           flattenedData.push({
//             Protein: d.Protein,
//             Class: column,
//             Value: d[column], // Access the value for each column
//           });
//         });
//       });

//       // Create heatmap tiles
//       plot
//         .selectAll(".tile")
//         .data(flattenedData) // Use the flattened data
//         .enter()
//         .append("rect")
//         .attr("class", "tile")
//         .attr("x", (d) => xScale(d.Class)) // Set x based on the column name
//         .attr("y", (d) => yScale(d.Protein)) // Set y based on the protein
//         .attr("width", xScale.bandwidth())
//         .attr("height", yScale.bandwidth())
//         .attr("fill", (d) => {
//           const value = +d.Value; // Use the value from the flattened data
//           return colorScale(value); // Adjust to color each tile based on value
//         })
//         .on("mouseover", function (event, d) {
//           const [x, y] = d3.pointer(event);
//           d3.select("#tooltip")
//             .style("display", "block")
//             .style(
//               "left",
//               `${Math.min(window.innerWidth - 100, event.pageX + 10)}px`
//             )
//             .style(
//               "top",
//               `${Math.min(window.innerHeight - 100, event.pageY - 10)}px`
//             )
//             .html(
//               `<strong>Protein:</strong> ${d.Protein}<br>` +
//                 `<strong>Class:</strong> ${d.Class}<br>` +
//                 `<strong>Value:</strong> ${d.Value}`
//             );
//         })
//         .on("mouseout", function () {
//           d3.select("#tooltip").style("display", "none");
//         });

//       // Append axes and labels (similar to your original code)
//       plot
//         .append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(xScale))
//         .selectAll(".tick text")
//         .attr("transform", "rotate(-90)")
//         .attr("x", -5)
//         .attr("dy", "0.32em")
//         .style("text-anchor", "end");

//       plot.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

//       plot
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr(
//           "transform",
//           `translate(${width / 2}, ${height + margin.top + 110})`
//         )
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .text("Class");

//       plot
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -margin.left + 30)
//         .attr("x", -(height / 2))
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .text("Proteins");

//       // Add legend
//       const legendWidth = 300;
//       const legendHeight = 10;
//       const legend = plot
//         .append("g")
//         .attr(
//           "transform",
//           `translate(${(width - legendWidth) / 2}, ${
//             height + margin.top + 125
//           })`
//         );

//       const legendScale = d3
//         .scaleLinear()
//         .domain(colorScale.domain())
//         .range([0, legendWidth]);

//       const legendAxis = d3
//         .axisBottom(legendScale)
//         .ticks(5)
//         .tickSize(-legendHeight);

//       legend
//         .selectAll("rect")
//         .data(colorScale.ticks(legendWidth))
//         .enter()
//         .append("rect")
//         .attr("x", (d) => legendScale(d))
//         .attr("y", 0)
//         .attr("width", legendWidth / colorScale.ticks(legendWidth).length)
//         .attr("height", legendHeight)
//         .attr("fill", (d) => colorScale(d));

//       legend
//         .append("g")
//         .attr("transform", `translate(0, ${legendHeight})`)
//         .call(legendAxis)
//         .call((g) => g.select(".domain").remove())
//         .call((g) =>
//           g
//             .selectAll(".tick line")
//             .attr("stroke", "#d0d0d0")
//             .attr("stroke-dasharray", "2,2")
//         );

//       plot
//         .append("g")
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr(
//           "transform",
//           `translate(${width / 2}, ${height + margin.top + 165})`
//         )
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .text("Legend");
//     }
//   }, [data]);

//   return (
//     <div className="heatmap-container graph-container">
//       <svg
//         ref={svgRef}
//         width={width + margin.left + margin.right}
//         height={height + margin.top + margin.bottom}
//       ></svg>
//       <div id="tooltip" className="tooltip"></div>
//     </div>
//   );
// };

// export default HeatmapComponent;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import "../D3GraphStyles.css";
// import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3v7";

// const HeatmapComponent = ({ jobId, fileName, numbVolcanoSamples, tab }) => {
//   const svgRef = useRef();
//   const resetButtonRef = useRef(null); // Reference for the reset button
//   const zoomRef = useRef(); // Reference for zoom behavior
//   const [data, setData] = useState([]);

//   const margin = { top: 20, right: 20, bottom: 200, left: 135 };
//   const width = 1000 - margin.left - margin.right;
//   const height = 1050 - margin.top - margin.bottom;

//   const cleanData = (data) => {
//     return data.slice(1).map((d) => {
//       const cleanedData = {};
//       for (let key in d) {
//         cleanedData[key] = d[key].replace(/^"|"$/g, "");
//       }
//       return cleanedData;
//     });
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       let cleanedData = cleanData(fileName);
//       if (tab.startsWith("Top")) {
//         cleanedData = cleanedData.slice(0, numbVolcanoSamples);
//       }
//       setData(cleanedData);
//     };

//     loadData();
//   }, [jobId, fileName, tab]);

//   useEffect(() => {
//     if (data.length > 0) {
//       const svg = d3.select(svgRef.current);
//       svg.selectAll("*").remove();

//       const plot = svg
//         .attr("preserveAspectRatio", "xMinYMin meet")
//         .attr(
//           "viewBox",
//           `0 0 ${width + margin.left + margin.right} ${
//             height + margin.top + margin.bottom
//           }`
//         )
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//       const labels = data.map((d) => d["Protein"]);
//       const columns = Object.keys(data[0]).slice(1);

//       const colorScale = d3
//         .scaleSequential(d3.interpolateRdBu)
//         .domain(d3.extent(data, (d) => +d[columns[0]]));

//       const xScale = d3
//         .scaleBand()
//         .domain(columns)
//         .range([0, width])
//         .padding(0.05);
//       const yScale = d3
//         .scaleBand()
//         .domain(labels)
//         .range([height, 0])
//         .padding(0.1);

//       plot
//         .append("g")
//         .attr("class", "grid")
//         .selectAll("line")
//         .data(xScale.domain())
//         .enter()
//         .append("line")
//         .attr("x1", (d) => xScale(d))
//         .attr("x2", (d) => xScale(d))
//         .attr("y1", 0)
//         .attr("y2", height)
//         .attr("stroke", "#e0e0e0");

//       plot
//         .append("g")
//         .attr("class", "grid")
//         .selectAll("line")
//         .data(yScale.domain())
//         .enter()
//         .append("line")
//         .attr("x1", 0)
//         .attr("x2", width)
//         .attr("y1", (d) => yScale(d))
//         .attr("y2", (d) => yScale(d))
//         .attr("stroke", "#e0e0e0");

//       const flattenedData = [];
//       data.forEach((d) => {
//         columns.forEach((column) => {
//           flattenedData.push({
//             Protein: d.Protein,
//             Class: column,
//             Value: d[column],
//           });
//         });
//       });

//       plot
//         .selectAll(".tile")
//         .data(flattenedData)
//         .enter()
//         .append("rect")
//         .attr("class", "tile")
//         .attr("x", (d) => xScale(d.Class))
//         .attr("y", (d) => yScale(d.Protein))
//         .attr("width", xScale.bandwidth())
//         .attr("height", yScale.bandwidth())
//         .attr("fill", (d) => colorScale(+d.Value))
//         .on("mouseover", function (event, d) {
//           const [x, y] = d3.pointer(event);
//           d3.select("#tooltip")
//             .style("display", "block")
//             .style(
//               "left",
//               `${Math.min(window.innerWidth - 100, event.pageX + 10)}px`
//             )
//             .style(
//               "top",
//               `${Math.min(window.innerHeight - 100, event.pageY - 10)}px`
//             )
//             .html(
//               `<strong>Protein:</strong> ${d.Protein}<br>` +
//                 `<strong>Class:</strong> ${d.Class}<br>` +
//                 `<strong>Value:</strong> ${d.Value}`
//             );
//         })
//         .on("mouseout", function () {
//           d3.select("#tooltip").style("display", "none");
//         });

//       plot
//         .append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(xScale))
//         .selectAll(".tick text")
//         .attr("transform", "rotate(-90)")
//         .attr("x", -5)
//         .attr("dy", "0.32em")
//         .style("text-anchor", "end");

//       plot.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

//       plot
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr(
//           "transform",
//           `translate(${width / 2}, ${height + margin.top + 110})`
//         )
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .text("Class");

//       plot
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -margin.left + 30)
//         .attr("x", -(height / 2))
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .text("Proteins");

//       const legendWidth = 300;
//       const legendHeight = 10;
//       const legend = plot
//         .append("g")
//         .attr(
//           "transform",
//           `translate(${(width - legendWidth) / 2}, ${
//             height + margin.top + 125
//           })`
//         );

//       const legendScale = d3
//         .scaleLinear()
//         .domain(colorScale.domain())
//         .range([0, legendWidth]);

//       const legendAxis = d3
//         .axisBottom(legendScale)
//         .ticks(5)
//         .tickSize(-legendHeight);

//       legend
//         .selectAll("rect")
//         .data(colorScale.ticks(legendWidth))
//         .enter()
//         .append("rect")
//         .attr("x", (d) => legendScale(d))
//         .attr("y", 0)
//         .attr("width", legendWidth / colorScale.ticks(legendWidth).length)
//         .attr("height", legendHeight)
//         .attr("fill", (d) => colorScale(d));

//       legend
//         .append("g")
//         .attr("transform", `translate(0, ${legendHeight})`)
//         .call(legendAxis)
//         .call((g) => g.select(".domain").remove())
//         .call((g) =>
//           g
//             .selectAll(".tick line")
//             .attr("stroke", "#d0d0d0")
//             .attr("stroke-dasharray", "2,2")
//         );

//       plot
//         .append("g")
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr(
//           "transform",
//           `translate(${width / 2}, ${height + margin.top + 165})`
//         )
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .text("Legend");

//       // Initialize zoom
//       const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);
//       zoomRef.current = zoom; // Save zoom behavior reference

//       svg.call(zoom);

//       // Ensure initial view has the y-axis labels visible
//       // svg.attr(
//       //   "transform",
//       //   `translate(${margin.left}, ${margin.top}) scale(1)`
//       // );

//       function zoomed(event) {
//         plot.attr("transform", event.transform);
//         if (!resetButtonRef.current) {
//           resetButtonRef.current = d3
//             .select(".heatmap-container")
//             .append("button")
//             .text("Reset Zoom")
//             .style("margin-top", "10px")
//             .on("click", () => {
//               svg
//                 .transition()
//                 .duration(750)
//                 .call(zoomRef.current.transform, d3.zoomIdentity)
//                 .on("end", () => {
//                   // plot.attr(
//                   //   "transform",
//                   //   `translate(${margin.left},${margin.top})`
//                   // );
//                   resetButtonRef.current.remove();
//                   resetButtonRef.current = null;
//                 });
//             });
//         }
//       }

//       // Reset zoom when tab changes
//       svg
//         .transition()
//         .duration(750)
//         .call(zoomRef.current.transform, d3.zoomIdentity)
//         .on("end", () => {
//           plot.attr("transform", `translate(${margin.left},${margin.top})`);
//           resetButtonRef.current.remove();
//           resetButtonRef.current = null;
//         });

//       // Ensure the reset button is removed if it exists when changing tabs
//       if (resetButtonRef.current) {
//         resetButtonRef.current.remove();
//         resetButtonRef.current = null;
//       }
//     }
//   }, [data, tab]); // Added `tab` to dependencies

//   return (
//     <div className="heatmap-container graph-container">
//       <svg
//         ref={svgRef}
//         width={width + margin.left + margin.right}
//         height={height + margin.top + margin.bottom}
//       ></svg>
//       <div id="tooltip" className="tooltip"></div>
//     </div>
//   );
// };

// export default HeatmapComponent;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import "../D3GraphStyles.css";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3v7";

const HeatmapComponent = ({ jobId, fileName, numbVolcanoSamples, tab }) => {
  const svgRef = useRef();
  const resetButtonRef = useRef(null); // Reference for the reset button
  const zoomRef = useRef(); // Reference for zoom behavior
  const [data, setData] = useState([]);

  const margin = { top: 20, right: 30, bottom: 200, left: 135 };
  const width = 1000 - margin.left - margin.right;
  const height = 1050 - margin.top - margin.bottom;

  const cleanData = (data) => {
    return data.slice(1).map((d) => {
      const cleanedData = {};
      for (let key in d) {
        cleanedData[key] = d[key].replace(/^"|"$/g, "");
      }
      return cleanedData;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      let cleanedData = cleanData(fileName);
      if (tab.startsWith("Top")) {
        cleanedData = cleanedData.slice(0, numbVolcanoSamples);
      }
      setData(cleanedData);
    };

    loadData();
  }, [jobId, fileName, tab]);

  useEffect(() => {
    if (data.length > 0) {
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

      // Extract unique labels and columns
      const labels = data.map((d) => d["Protein"]);
      const columns = Object.keys(data[0]).slice(1);

      const colorScale = d3
        .scaleSequential(d3.interpolateRdBu)
        .domain(d3.extent(data, (d) => +d[columns[0]]));

      const xScale = d3
        .scaleBand()
        .domain(columns)
        .range([0, width])
        .padding(0.05);
      const yScale = d3
        .scaleBand()
        .domain(labels)
        .range([height, 0])
        .padding(0.1);

      // Add zoom functionality
      const zoomed = (event) => {
        const { transform } = event;
        plot.attr("transform", transform);
        plot.attr("stroke-width", 1 / transform.k);
      };

      const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

      svg.call(zoom);
      zoomRef.current = zoom;

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

      // Flatten the data to create a suitable structure for the heatmap
      const flattenedData = [];
      data.forEach((d) => {
        columns.forEach((column) => {
          flattenedData.push({
            Protein: d.Protein,
            Class: column,
            Value: d[column],
          });
        });
      });

      // Create heatmap tiles
      plot
        .selectAll(".tile")
        .data(flattenedData)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", (d) => xScale(d.Class))
        .attr("y", (d) => yScale(d.Protein))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(+d.Value))
        .on("mouseover", function (event, d) {
          const [x, y] = d3.pointer(event);
          d3.select("#tooltip")
            .style("display", "block")
            .style(
              "left",
              `${Math.min(window.innerWidth - 100, event.pageX + 10)}px`
            )
            .style(
              "top",
              `${Math.min(window.innerHeight - 100, event.pageY - 10)}px`
            )
            .html(
              `<strong>Protein:</strong> ${d.Protein}<br>` +
                `<strong>Class:</strong> ${d.Class}<br>` +
                `<strong>Value:</strong> ${d.Value}`
            );
        })
        .on("mouseout", function () {
          d3.select("#tooltip").style("display", "none");
        });

      // Append axes and labels
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

      plot.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.top + 110})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Class");

      plot
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 30)
        .attr("x", -(height / 2))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Proteins");

      // Add legend
      const legendWidth = 300;
      const legendHeight = 10;
      const legend = plot
        .append("g")
        .attr(
          "transform",
          `translate(${(width - legendWidth) / 2}, ${
            height + margin.top + 125
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
          `translate(${width / 2}, ${height + margin.top + 165})`
        )
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Legend");

      // Reset zoom when the tab changes
      if (resetButtonRef.current) {
        resetButtonRef.current.addEventListener("click", () => {
          svg
            .transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity)
            .on("end", () => {
              plot.attr("transform", `translate(${margin.left},${margin.top})`);
            });
        });
      }
    }
  }, [data, tab]);

  return (
    <div className="heatmap-container graph-container">
      <button ref={resetButtonRef} className="heatmap-reset-button">
        Reset Zoom
      </button>
      <svg
        ref={svgRef}
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      ></svg>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default HeatmapComponent;
