export const AxisBottom = ({ xScale, innerHeight, tickFormat }) =>
  xScale.ticks().map((tickValue) => (
    <g
      className="tick"
      key={tickValue}
      transform={`translate(${xScale(tickValue)},0)`}
    >
      <line y2={innerHeight} style={{ stroke: "#C0C0BB" }} />
      <span style={{ textAnchor: "middle" }} dy=".71em" y={innerHeight + 3}>
        {tickFormat(tickValue)}
      </span>
    </g>
  ));
