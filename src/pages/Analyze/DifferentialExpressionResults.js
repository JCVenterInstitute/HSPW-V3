import { useEffect, useState } from "react";
import { Alert, Box, Container } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import OptionsBar from "@Components/Analyze/DifferentiaExpAnalysisResults/OptionsBar";
import PageHeader from "@Components/Layout/PageHeader";
import ResultSection from "@Components/Analyze/DifferentiaExpAnalysisResults/ResultSection";
import CustomLoadingOverlay from "../../components/Shared/LoadingOverlay";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Volcano Plot");

  useEffect(() => {
    // Redirects to the home page if no search params
    if (searchParams.size === 0) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  useEffect(() => {
    const decryptParam = async () => {
      const params = await axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/api/decrypt`, {
          token: searchParams.get("data"),
        })
        .then((res) => res.data);

      setData(params.data);
    };

    if (searchParams.size > 0) decryptParam();
  }, [searchParams]);

  // If no search params, show error message and redirect to home page
  if (searchParams.size === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "45vh",
        }}
      >
        <Alert
          sx={{
            fontSize: "30px",
            "& .MuiAlert-icon": {
              fontSize: 40,
            },
          }}
          severity="error"
        >
          <strong>404 - Submission Not Found</strong>
          <br />
          Sorry, the page you are looking for does not exist.
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return <CustomLoadingOverlay />;
  }

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
            numbOfTopVolcanoSamples={data ? data["heat_map_number"] : 25}
            searchParams={data}
            jobId={data["s3_file_location"]}
          />
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
