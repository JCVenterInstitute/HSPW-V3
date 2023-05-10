import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Disease", "Number of Samples"],
  ["COVID-19", 120],
  ["Oral Squamous Cell Carcinoma", 10],
  ["Sjogren's Syndrome", 7],
  ["Disease Free", 859] // CSS-style declaration
];

export const options = {
  title: "Disease Types",
  pieHole: 0.4,
  is3D: false,
  titlePosition:'out',
  titleTextStyle:{
    fontSize:'18',
    bold:true,
  }
};

export function donutChart_google() {
  return (
    <Chart
      chartType="PieChart"
      width="600px"
      height="250px"
      data={data}
      options={options}
    />
  );
}

export default donutChart_google;