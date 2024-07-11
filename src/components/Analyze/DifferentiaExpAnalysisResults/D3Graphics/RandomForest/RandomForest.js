import React, { useEffect, useState } from "react";
import { fileMapping } from "../../Constants";
import { fetchCSV, fetchImage } from "../../utils";
import CSVDataTable from "../../../../../pages/Analyze/CSVDataTable";
import DotGraph from "../DotGraph/DotGraph";
import { Box, CircularProgress, Container } from "@mui/material";

const RandomForest = ({ selectedSection, tab, jobId }) => {
  const [files, setFiles] = useState(fileMapping["Random Forest"]);
  const [image, setImage] = useState(null);
  const [tableData, setTable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (tab === null || !files[tab]) return;

      // Classification & Feature tabs have additional table to display
      if (tab === "Classification" || tab === "Feature") {
        const { data } = await fetchCSV(jobId, files[tab][1]);
        setTable(data);
      } else {
        setTable(null);
      }

      const imageUrl = await fetchImage(jobId, files[tab][0]);
      setImage(imageUrl);
      setLoading(false);
    };

    setLoading(true);
    fetchData();
  }, [tab, files, jobId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          flexDirection: "column",
        }}
      >
        {tab !== "Feature" && (
          <img
            src={image}
            alt={`${selectedSection} ${tab}`}
            style={{ maxWidth: "1200px" }}
          />
        )}
        {tableData ? (
          <Container sx={{ margin: "0px" }}>
            <Box
              sx={{
                overflowX: "auto", // Enable horizontal scrolling
                width: "100%",
              }}
            >
              {tab === "Feature" && <DotGraph jobId={jobId} />}
              <CSVDataTable
                data={tableData}
                selectedSection={selectedSection}
              />
            </Box>
          </Container>
        ) : null}
      </Box>
    </>
  );
};

export default RandomForest;
