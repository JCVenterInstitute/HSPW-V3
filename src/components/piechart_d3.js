import React, { useEffect,useRef,useState } from 'react';
import * as d3 from 'd3';

function PieChart() {
    const [data] = useState([
        {property:'Domains',value:1523},
        {property:'Families',value:1538},
        {property:'Repeats',value:58},
        {property:'Sites',value:9},
    ]);

    const svgRef = useRef();
    
    const labelHeight = 18;

    useEffect(() => {
        const w = 200;
        const h = 200;
        const radius = w/2;

        const svg = d3.select(svgRef.current)
            .attr('width',w)
            .attr('height',h)
            .style('overflow','visible')
            .style('margin-top','100px')
            .style('margin-left','45%');

        const formattedData = d3.pie().value(d=>d.value)(data);
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
        const color = d3.scaleOrdinal().range(d3.schemeSet2);
        
        svg.selectAll()
            .data(formattedData)
            .join('path')
                .attr('d',arcGenerator)
                .attr('fill',d=>color(d.value))
                .style('opacity',0.7);
        

        const legend = svg
            .append('g')
            .attr('transform', `translate(${radius * 2 + 20},0)`);
        
            legend
            .selectAll(null)
            .data(formattedData)
            .enter()
            .append('rect')
            .attr('y', d => labelHeight * d.index * 1.8)
            .attr('width', labelHeight)
            .attr('height', labelHeight)
            .attr('fill', d=>color(d.value))
            .attr('stroke', 'grey')
            .style('stroke-width', '1px');

        legend
            .selectAll(null)
            .data(formattedData)
            .enter()
            .append('text')
            .text(d => d.data.property+' (' +d.data.value +')')
            .attr('x', labelHeight * 1.2)
            .attr('y', d => labelHeight * d.index * 1.8 + labelHeight)
            .style('font-family', 'sans-serif')
            .style('font-size', `${labelHeight}px`);

    },[data]);

    return (
        <svg ref = {svgRef}></svg>
    )
}

export default PieChart;