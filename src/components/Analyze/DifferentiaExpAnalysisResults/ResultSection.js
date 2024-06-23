import { useEffect, useState } from "react";

import TabDescription from "./TabDescription";
import TabOptions from "./TabOptions";
import { fetchCSV } from "./utils";
import { fileMapping } from "./Constants";
import { getFileUrl } from "./utils";
import DataSection from "./DataSection";
import { Box, CircularProgress } from "@mui/material";

const ResultSection = ({ selectedSection, jobId, searchParams }) => {
  const [tab, setTab] = useState("Visualization");
  const [files, setFiles] = useState({});
  const [allData, setAllData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Get & return all_data.tsv download link & file contents
   */
  const getAllDataFile = async () => {
    try {
      const { data, downloadUrl, textUrl } = await fetchCSV(
        jobId,
        "all_data.tsv"
      );

      setAllData({
        data,
        downloadUrl,
        textUrl,
      });
    } catch (err) {
      console.error("> Error fetching all data file", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all_data.tsv, shared across all tab sections
  useEffect(() => {
    getAllDataFile();
  }, []);

  /**
   * Fetch all files associated with the selected results section
   * @param {string} selectedSection Results section currently selected
   * @param {string} jobId Id of analysis submission job
   */
  const fetchFiles = async (selectedSection, jobId) => {
    const mappedSectionFiles = fileMapping[selectedSection];

    // No files to fetch
    if (mappedSectionFiles === undefined || mappedSectionFiles === null) return;

    try {
      setIsLoading(true);
      let files = {};

      if (typeof mappedSectionFiles === "string") {
        files = await getFileUrl(jobId, mappedSectionFiles);
      } else {
        for (const [tabName, fileName] of Object.entries(mappedSectionFiles)) {
          const fileUrl = await getFileUrl(jobId, fileName);

          files[tabName] = fileUrl;
        }
      }

      setFiles(files);
    } catch (err) {
      console.error("> Failed trying to fetch all files", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all needed files for the current selected section
  useEffect(() => {
    fetchFiles(selectedSection, jobId);
  }, [selectedSection]);

  return (
    <>
      <TabOptions
        numbOfTopVolcanoSamples={searchParams.get("heatmap")}
        selectedSection={selectedSection}
        setTab={setTab}
        jobId={jobId}
        tab={tab}
      />
      <TabDescription
        tab={tab}
        selectedSection={selectedSection}
        numbOfTopVolcanoSamples={searchParams.get("heatmap")}
      />
      {isLoading ? (
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
      ) : (
        <DataSection
          selectedSection={selectedSection}
          allData={allData}
          files={files}
          jobId={jobId}
          tab={tab}
          searchParams={searchParams}
        />
      )}
    </>
  );
};

export default ResultSection;
