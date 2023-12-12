import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Disease", "Number of Samples"],
  ["COVID-19", 120],
  ["Oral Squamous Cell Carcinoma", 10],
  ["Sjogren's Syndrome", 7],
  ["Disease Free", 859], // CSS-style declaration
];

export const options = {
  title: "Condition Types",
  pieHole: 0.4,
  is3D: false,
  titlePosition: "out",
  titleTextStyle: {
    fontSize: "22",
    bold: true,
    fontColor: "#565656",
    fontName: "Lato",
  },
  colors: ["#C3F968", "#71E2E8", "#527E8C", "#F3CA3A"],
  legend: {
    textStyle: {
      fontSize: 16,
      fontColor: "#565656",
      fontName: "Lato",
    },
  },
  pieSliceTextStyle: {
    color: "#565656",
  },
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
