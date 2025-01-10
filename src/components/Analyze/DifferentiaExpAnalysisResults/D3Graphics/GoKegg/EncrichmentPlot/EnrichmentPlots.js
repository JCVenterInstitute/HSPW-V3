import BarChartComponent from "./BarPlot";

const EnrichmentPlots = ({ upRegData, downRegData }) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <BarChartComponent
        title={"Up Regulated Differentially Abundant Proteins"}
        plotData={upRegData}
      />
      <BarChartComponent
        title={"Down Regulated Differentially Abundant Proteins"}
        plotData={downRegData}
      />
    </div>
  );
};

export default EnrichmentPlots;
