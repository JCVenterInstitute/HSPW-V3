import BarChartComponent from "./BarPlot";

const EnrichmentPlots = ({ upRegData, downRegData }) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <BarChartComponent plotData={upRegData} />
      <BarChartComponent plotData={downRegData} />
    </div>
  );
};

export default EnrichmentPlots;
