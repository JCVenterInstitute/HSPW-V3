import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect } from "react";

const TabOptions = ({
  tab,
  selectedSection,
  handleTabChange,
  handleDataDownload,
  numbOfTopVolcanoSamples,
  setTab,
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
    const tabOptions = getTabOptions(selectedSection);
    setTab(tabOptions ? tabOptions[0] : null);
  }, [selectedSection]);

  /**
   * Get the list of tabs for the selected section result section
   * @returns String array of tabs for the current selected section
   */
  const getTabOptions = () => {
    let tabOptions;

    switch (selectedSection) {
      case "Heatmap":
        tabOptions = [`Top ${numbOfTopVolcanoSamples} Samples`, "All Samples"];
        break;
      case "Random Forest":
        tabOptions = ["Classification", "Feature", "Outlier"];
        break;
      case "Volcano Plot":
      case "Statistical Parametric Test":
      case "Fold Change Analysis":
      case "Principal Component Analysis":
      case "Venn-Diagram":
      case "Normalization":
        tabOptions = ["Visualization", "Data Matrix"];
        break;
      case "GO Biological Process":
        tabOptions = [
          "placeholder1",
          "placeholder2",
          "placeholder3",
          "placeholder4",
          "placeholder5",
        ];
        break;
      case "GO Molecular Function":
        tabOptions = [
          "placeholder1",
          "placeholder2",
          "placeholder3",
          "placeholder4",
          "placeholder5",
        ];
        break;
      case "GO Cellular Component":
        tabOptions = [
          "placeholder1",
          "placeholder2",
          "placeholder3",
          "placeholder4",
          "placeholder5",
        ];
        break;
      case "KEGG Pathway/Module":
        tabOptions = [
          "placeholder1",
          "placeholder2",
          "placeholder3",
          "placeholder4",
          "placeholder5",
        ];
        break;
      default:
        tabOptions = null;
    }

    return tabOptions;
  };

  const createTabGroup = (selectedSection) => {
    let tabOptions = getTabOptions(selectedSection);

    // No tab options for this menu item
    if (tabOptions === null) return null;

    const tabButtons = tabOptions.map((tab, i) => {
      return (
        <ToggleButton
          key={`${selectedSection}-tab-${i}`}
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
        onChange={handleTabChange}
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
            onClick={handleDataDownload}
          >
            Download
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TabOptions;
