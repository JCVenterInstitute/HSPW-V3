import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { handleDownload } from "./utils";
import { fileMapping } from "./Constants";
import { getTabOptions } from "./utils";

const TabOptions = ({
  tab = null,
  selectedSection,
  setTab,
  numbOfTopVolcanoSamples,
  jobId,
}) => {
  const [fileName, setFileName] = useState(
    tab !== null && fileMapping[selectedSection]
      ? fileMapping[selectedSection][tab]
      : fileMapping[selectedSection]
  );

  const style = {
    tabStyle: {
      backgroundColor: "#EBEBEB",
      borderRadius: "16px",
      "& .MuiToggleButtonGroup-grouped": {
        margin: "7px 5px",
        border: "none",
        padding: "5px 10px",
        fontFamily: "Montserrat",
        borderRadius: "16px !important",
        "&.Mui-selected": {
          backgroundColor: "#1463B9",
          color: "white",
          "&:hover": {
            backgroundColor: "#6B9AC4",
          },
        },
        "&:not(.Mui-selected)": {
          color: "#1463B9",
          "&:hover": {
            backgroundColor: "#BBD1E9",
          },
        },
      },
    },
    downloadButton: {
      textAlign: "right",
      justifyContent: "flex-end", // To push content to the right
      flexGrow: 1, // To make the right Box occupy remaining space
    },
  };

  // Get correct file name for download when tab or section switched
  useEffect(() => {
    let name =
      tab && fileMapping[selectedSection]
        ? fileMapping[selectedSection][tab]
        : fileMapping[selectedSection];

    // Handle special case for Heat Map first tab
    if (tab && name === undefined && tab.startsWith("Top")) {
      name = fileMapping[selectedSection]["Top Samples"];
    }

    setFileName(name);
  }, [tab, selectedSection]);

  // When selecting a new section, go back to first tab of that section
  useEffect(() => {
    const tabOptions = getTabOptions(selectedSection, numbOfTopVolcanoSamples);
    setTab(tabOptions ? tabOptions[0] : null);
  }, [selectedSection]);

  const downloadD3Plots = () => {
    const d3ToPng = require("d3-svg-to-png");

    let graphs = document.getElementsByClassName("graph-container");

    // If scale is greater than 1, image is cut off when downloaded
    // If scale is too low, the image is blurry for other browsers when downloaded
    const isChrome = navigator.userAgent.toLowerCase().includes("chrome");
    const scale = isChrome ? 1 : 5;

    const downloadSVG = (graph) =>
      d3ToPng(graph, selectedSection, {
        scale,
        format: "webp",
        quality: 1,
        download: true,
        ignore: ".download-ignored",
      });

    for (let i of graphs) {
      downloadSVG(i);
    }
  };

  const createTabGroup = (selectedSection) => {
    let tabOptions = getTabOptions(selectedSection, numbOfTopVolcanoSamples);

    // No tab options for this menu item
    if (!tabOptions) return null;

    const tabButtons = tabOptions.map((tab, i) => {
      let label = tab;

      // For Heatmap, update tab based on user input param for top samples
      if (tab === "Top Samples") {
        const tok = tab.split(" ");
        label = `${tok[0]} ${numbOfTopVolcanoSamples} ${tok[1]}`;
      }

      return (
        <ToggleButton
          className="tab-button"
          key={`${selectedSection}-tab-${i}`}
          sx={{ fontSize: "13px" }}
          value={tab}
        >
          {tab}
        </ToggleButton>
      );
    });

    return (
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={(event, newTab) => {
          if (newTab !== null) {
            setTab(newTab);
          }
        }}
        sx={{ ...style.tabStyle }}
      >
        {tabButtons}
      </ToggleButtonGroup>
    );
  };

  return (
    <Box
      id="option-tab-box"
      sx={{ display: "flex", alignItems: "center" }}
    >
      <Box style={{ display: "flex", width: "100%", maxWidth: "1100px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {createTabGroup(selectedSection)}
        </Box>
      </Box>
      {selectedSection !== "Download" && (
        <Box sx={style.downloadButton}>
          {tab &&
          (tab === "Visualization" ||
            tab === "GSEA Ridge plot" ||
            tab === "Enrichment Plot") ? (
            <Button
              variant="contained"
              onClick={downloadD3Plots}
            >
              Download
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                handleDownload(jobId, fileName);
              }}
            >
              Download
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TabOptions;
