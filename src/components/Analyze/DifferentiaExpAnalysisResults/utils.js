import axios from "axios";
import * as Papa from "papaparse";

import { sectionToTabs } from "./Constants";

/**
 * Get the list of tabs for the selected section result section
 * @returns String array of tabs for the current selected section
 */
export const getTabOptions = (selectedSection, numbOfTopVolcanoSamples) => {
  let options = sectionToTabs[selectedSection];

  // Heatmap's first tab depends on param user enters so update placeholder text
  if (selectedSection === "Heatmap") {
    const topX = options[0].replace(
      "<-numbOfTopVolcanoSamples->",
      numbOfTopVolcanoSamples
    );

    options[0] = topX;
  }

  return options;
};

/**
 * Fet the relevant style needed for the image depending on selected section
 * @param {string} selectedItem Current section selected by user
 */
export const getImageStyle = (selectedItem) => {
  if (selectedItem === "Venn-Diagram") {
    return {
      maxWidth: "600px",
      maxHeight: "600px",
      width: "100%",
      height: "auto",
    };
  }

  return { maxWidth: "100%", maxHeight: "100%", height: "auto" };
};

/**
 * Returns the data file & the download link for the file
 * @param {*} jobId Id of analysis submission job, used to help locate s3 file
 * @param {*} fileName Name of the s3 file
 * @returns {Object} Object containing parsed TSV data, download URL
 */
export const fetchDataFile = async (
  jobId,
  fileName,
  selectedSection = null
) => {
  try {
    let response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );

    const dataText = await axios.get(response.data.url).then((res) => res.data);

    return {
      data: Papa.parse(
        // Files with ID at the start have a duplicate, unnamed ID column so we add a blank header at the beginning
        dataText.startsWith('"ID"\t') ? '" "'.concat("\t", dataText) : dataText,
        {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header, index) => {
            if (index === 0 && (header === "" || header === "rn")) {
              // PCA files contain Sample instead of Proteins unlike all other files
              return fileName.startsWith("pca") ? "Sample" : "Protein";
            } else {
              return header;
            }
          },
        }
      ).data,
      downloadUrl: response.data.url,
    };
  } catch (error) {
    console.error("Error fetching data file:", error);
  }
};

export const fetchData = async (url) => {
  try {
    let csv = await axios.get(url).then((res) => res.data);

    return Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header, index) => {
        if (index === 0 && (header === "" || header === "rn")) {
          return url.includes("pca_") ? "Sample" : "Protein";
        } else {
          return header;
        }
      },
    }).data;
  } catch (error) {
    console.error("Error fetching csv:", error);
  }
};

/**
 * Download the specified file from the submission
 * @param {string} jobId Id of analysis submission job
 * @param {string} fileName Name of file from the submission to download
 */
export const handleDownload = async (jobId, fileName) => {
  try {
    let file = fileName;

    // Handle random forest download, some tab contains multiple files first one is the image
    if (typeof file === "object") file = file[0];

    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${file}`
    );
    const link = document.createElement("a");
    link.href = res.data.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

/**
 * Get s3 link for a file from the submission
 * @param {string} jobId Id of analysis submission job
 * @param {string} fileName Name of file to get file url
 * @returns
 */
export const getFileUrl = async (jobId, fileName) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );
    return response.data.url;
  } catch (error) {
    console.error("Error getting file url:", error);
  }
};

export const fetchImage = async (jobId, fileName) => {
  try {
    let response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );
    return response.data.url;
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};
