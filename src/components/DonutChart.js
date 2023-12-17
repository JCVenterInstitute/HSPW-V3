import DonutChart from "react-donut-chart";

import "./DonutChart.css";

export default function donutChart() {
  const data = [
    {
      count: 10, // Value of the property. Required.
      color: "#000000", // Color code for the pie's color. Required.
      name: "My name", // Optional value. Used to display in the tooltip.
    },
    {
      count: 10, // Value of the property. Required.
      color: "#ff0000", // Color code for the pie's color. Required.
      name: "XCS", // Optional value. Used to display in the tooltip.
    },
    {
      count: 20, // Value of the property. Required.
      color: "#00ff00", // Color code for the pie's color. Required.
      name: "XCS", // Optional value. Used to display in the tooltip.
    },
  ];

  return (
    <div className="App">
      <h4>Disease Type</h4>
      <DonutChart
        outerRadius={0.6}
        innerRadius={0.4}
        legend={false}
        width={200}
        height={200}
        interactive={true}
        colors={["#FFA500", "#90EE90", "#2ade2a", "#2a84de"]}
        data={[
          {
            label: "COVID-19",
            value: 120,
            color: "#FFA500",
          },
          {
            label: "Oral Squamous Cell Carcinoma",
            value: 10,
            color: "#90EE90",
          },
          {
            label: "Sjogren's Syndrome",
            value: 7,
            color: "#2ade2a",
          },
          {
            label: "Disease Free",
            value: 859,
            color: "#2a84de",
          },
        ]}
      />
    </div>
  );
}
