import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  [
    "Tissue",
    "Number of Samples",
    { role: "style" },
    {
      sourceColumn: 0,
      role: "annotation",
      type: "string",
      calc: "stringify",
    },
  ],
  ["SM gland", 165, "light blue", null],
  ["SL gland", 155, "light blue", null],
  ["Parotid gland", 345, "light blue", null],
  ["WS", 344, "light blue", null],
  ["Blood", 50, "light blue", null],
];

export const options = {
  title: "Sample Types",
  width: 650,
  height: 295,
  bar: { groupWidth: "45%" },
  legend: { position: "none" },
  titlePosition: "out",
  titleTextStyle: {
    fontSize: "22",
    bold: true,
    fontColor: "#565656",
    fontName: "Lato",
  },
  vAxis: {
    textStyle: {
      fontSize: 16,
      fontColor: "#565656",
      fontName: "Lato",
    },
  },
  hAxis: {
    ticks: [0, 50, 100, 150, 200, 250, 300, 350],
  },
};

export function barChart_google() {
  return (
    <Chart
      chartType="BarChart"
      width="500px"
      height="250px"
      data={data}
      options={options}
    />
  );
}

export default barChart_google;
