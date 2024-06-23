import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect } from "react";
import { handleDownload } from "./utils";
import { fileMapping, sectionToTabs } from "./Constants";

const TabOptions = ({
  tab,
  selectedSection,
  setTab,
  numbOfTopVolcanoSamples,
  jobId,
}) => {
  const style = {
    tabStyle: {
      backgroundColor: "#EBEBEB",
      borderRadius: "16px",
      "& .MuiToggleButtonGroup-grouped": {
        margin: "7px 5px",
        border: "none",
        padding: "8px 12px",
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

  // When selecting a new section, go back to first tab of that section
  useEffect(() => {
    const tabOptions = sectionToTabs[selectedSection];
    setTab(tabOptions ? tabOptions[0] : null);
  }, [selectedSection]);

  const createTabGroup = (selectedSection) => {
    let tabOptions = sectionToTabs[selectedSection];

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
          key={`${selectedSection}-tab-${i}`}
          value={tab}
        >
          {label}
        </ToggleButton>
      );
    });

    return (
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={(e) => setTab(e.target.value)}
        sx={{ ...style.tabStyle, marginTop: "10px" }}
      >
        {tabButtons}
      </ToggleButtonGroup>
    );
  };

  return (
    <Box
      id="option-tab-box"
      sx={{ display: "flex" }}
    >
      <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {createTabGroup(selectedSection)}
        </Box>
      </Box>
      {selectedSection !== "Download" && (
        <Box sx={style.downloadButton}>
          <Button
            variant="contained"
            onClick={() =>
              handleDownload(
                jobId,
                tab !== null
                  ? fileMapping[selectedSection][tab]
                  : fileMapping[selectedSection]
              )
            }
          >
            Download
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TabOptions;
