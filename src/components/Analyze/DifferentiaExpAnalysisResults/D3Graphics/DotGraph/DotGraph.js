import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchCSV } from '../../utils.js';
import './DotGraph.css';

const DotGraph = ({ containerId, jobId, datafile }) => {
  const ref = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await fetchCSV(jobId, datafile);
        const jsonData = csvData.map(d => ({
          type: d.type,
          mean_degrees_accuracy: +d.MeanDecreaseAccuracy,
        }));

        // Sort the data and take the top 15
        const topData = jsonData
          .sort((a, b) => b.mean_degrees_accuracy - a.mean_degrees_accuracy)
          .slice(0, 15);
        setData(topData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [jobId, datafile]);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(ref.current).attr('width', 800);
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = data.length * 30 + margin.top + margin.bottom;

    svg.attr('height', height + margin.top + margin.bottom);

    const x = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.mean_degrees_accuracy),
        d3.max(data, d => d.mean_degrees_accuracy),
      ])
      .range([margin.left, width + margin.left]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.type))
      .range([margin.top, height])
      .padding(0.1);

    // Create a tooltip div
    const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

    svg.append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.mean_degrees_accuracy))
      .attr('cy', d => y(d.type) + y.bandwidth() / 2)
      .attr('r', 5)
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Type: ${d.type}<br/>Accuracy: ${d.mean_degrees_accuracy}`)
          .style('left', event.pageX + 5 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'axis')
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('class', 'axis')
      .call(d3.axisLeft(y));

    svg.append('g')
      .selectAll('line')
      .data(data)
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', width + margin.left)
      .attr('y1', d => y(d.type) + y.bandwidth() / 2)
      .attr('y2', d => y(d.type) + y.bandwidth() / 2)
      .attr('class', 'line');

    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width + margin.left)
      .attr('y1', margin.top)
      .attr('y2', margin.top)
      .attr('class', 'border-line');

    svg.append('line')
      .attr('x1', width + margin.left)
      .attr('x2', width + margin.left)
      .attr('y1', margin.top)
      .attr('y2', height)
      .attr('class', 'border-line');

    svg.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', (width + margin.left) / 2)
      .attr('y', height + margin.bottom - 10)
      .text('Mean Decrease Accuracy');

    return () => tooltip.remove();
  }, [data]);

  return (
    <div className="graph-container">
      <svg ref={ref}></svg>
    </div>
  );
};

export default DotGraph;