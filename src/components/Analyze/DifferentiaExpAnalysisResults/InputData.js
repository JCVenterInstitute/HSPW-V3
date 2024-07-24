import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import AnalysisOptionsTable from "../DifferentialExpressionAnalysis/AnalysisOptionsTable";
import { fetchDataFile } from "./utils";
import CSVDataTable from "../../../pages/Analyze/CSVDataTable";

const InputData = ({ searchParams, jobId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOriginalInput = async () => {
      try {
        const { data, downloadUrl } = await fetchDataFile(
          jobId,
          "data_original.csv"
        );
        setData({
          data,
          downloadUrl,
        });

        console.log("> Data", data);
      } catch (err) {
        console.error("> Error fetching all data file", err);
      }
    };

    fetchOriginalInput();
  }, []);

  return data !== null ? (
    <Container sx={{ margin: "0px" }}>
      <Typography variant="h5" sx={{ fontFamily: "Lato" }}>
        Analysis Options:
      </Typography>
      <AnalysisOptionsTable searchParams={searchParams} />
      <Typography
        variant="h5"
        sx={{ fontFamily: "Lato", marginBottom: "15px" }}
      >
        Input Data:
      </Typography>
      <Box
        sx={{
          overflowX: "auto", // Enable horizontal scrolling
          width: "100%",
        }}
      >
        <CSVDataTable data={data["data"]} selected={"Input Data"} />
      </Box>
    </Container>
  ) : null;
};

export default InputData;
