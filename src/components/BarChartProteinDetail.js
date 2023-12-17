import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["", "RNA Expression (NX)",{type: 'string', role: 'annotation'}, "Protein Localization (score)",{type: 'string', role: 'annotation'}],
  ["Adipose tissue", 0,'0', 0,'n/a'],
  ["Adrenal gland", -0.1,'0.1', 0,'n/a'],
  ["Amygdala", -0.5,'0.5', 0,'n/a'],
  ["Appendix", 0,'0', 0,'n/a'],
  ["Basal ganglia", -0.9,'0.9', 0,'n/a'],
];

export const options = {
  chartArea: { width: "50%" },
  colors: ["#b0120a", "#ffab91"],
};

export function BarChart() {
  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}

export default BarChart;