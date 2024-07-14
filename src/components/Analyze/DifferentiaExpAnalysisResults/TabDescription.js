import { Typography } from "@mui/material";

import descriptions from "../DifferentialExpressionAnalysis/AnalysisDescription";

const TabDescription = ({ tab, selectedSection, numbOfTopVolcanoSamples }) => {
  let description = descriptions[selectedSection];

  if (typeof description === "object") description = description[tab];

  if (description)
    return (
      <Typography sx={{ fontFamily: "Lato", mt: 2, ml: 1 }}>
        <span
          dangerouslySetInnerHTML={{
            __html: description.replaceAll(
              "numberOfDifferentiallyAbundantProteinsInHeatmap",
              numbOfTopVolcanoSamples
            ),
          }}
        />
      </Typography>
    );
};

export default TabDescription;
