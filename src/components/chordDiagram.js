import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ChordDiagram = (props) => {
    const chartRef = useRef(null);
    useEffect(() => {
        var fill = d3.scaleOrdinal()
         .range(["#D2D0C6","#ECD08D","steelblue","#DB704D","steelblue","khaki","yellowgreen","crimson","darkslateblue","gold","green" ]);

        var svg = d3.select(chartRef.current)
  .append("svg")
    .attr("width", 440)
    .attr("height", 440)
  .append("g")
    .attr("transform", "translate(220,220)")

// create input data: a square matrix that provides flow between entities
var matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];

// give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
var res = d3.chord()
    .padAngle(0.05)     // padding between entities (black arc)
    .sortSubgroups(d3.descending)
    (matrix)

// add the groups on the inner part of the circle
svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(function(d) { return d.groups; })
  .enter()
  .append("g")
  .append("path")
    .style("fill", "grey")
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(200)
      .outerRadius(210)
    )

// Add the links between groups
svg
  .datum(res)
  .append("g")
  .selectAll("path")
  .data(function(d) { return d; })
  .enter()
  .append("path")
    .attr("d", d3.ribbon()
      .radius(200)
    )
    .style("fill", function(d) { return fill(d.index); })
    .style("stroke", "black");
    },[]);
    return <div ref={chartRef}></div>;
};
export default ChordDiagram;