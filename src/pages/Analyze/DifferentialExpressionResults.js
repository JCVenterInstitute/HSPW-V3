import { useState } from "react";
import { Container } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";

import OptionsBar from "../../components/Analyze/DifferentiaExpAnalysisResults/OptionsBar";
import PageHeader from "../../components/PageHeader";
import ResultSection from "../../components/Analyze/DifferentiaExpAnalysisResults/ResultSection";

const breadcrumbPath = [
  { path: "Home", link: "/" },
  { path: "Analyze" },
  {
    path: "Differential Expression Analysis",
    link: "/differential-expression",
  },
  { path: "Analysis Results" },
];

const DifferentialExpressionResults = () => {
  const [searchParams] = useSearchParams();
  const { jobId } = useParams();
  const [selectedSection, setSelectedSection] = useState("Volcano Plot");

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Differential Expression Results"}
        breadcrumb={breadcrumbPath}
        title={"Differential Expression Analysis Results"}
        description={
          "Visual analytics will identify proteins with differential abundance between experiments in Groups A and B based on their normalized spectral counts."
        }
      />
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
        }}
      >
        <OptionsBar
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
        <Container
          maxWidth="xl"
          sx={{ margin: "30px 0 30px 20px" }}
        >
          <ResultSection
            selectedSection={selectedSection}
            numbOfTopVolcanoSamples={searchParams.get("heatmap")}
            searchParams={searchParams}
            jobId={jobId}
          />
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
