import axios from "axios";
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
 *
 * @param {*} csvText
 * @param {*} selectedSection
 * @returns
 */
export const parseCSV = (csvText, selectedSection) => {
  const lines = csvText.split("\n");

  // Detect delimiter (comma or tab)
  const delimiter = lines[0].indexOf("\t") >= 0 ? "\t" : ",";

  // Split the first line with the detected delimiter to get headers
  let headers = lines[0].split(delimiter);

  // Replace the first header if it's empty and remove quotes from all headers
  headers = headers.map((header, index) => {
    if (
      index === 0 &&
      (header.replace(/['"]+/g, "") === "" ||
        header.replace(/['"]+/g, "") === "rn")
    ) {
      return selectedSection === "Principal Component Analysis"
        ? "Sample"
        : "Protein";
    } else {
      return header.replace(/['"]+/g, "");
    }
  });

  const parsedData = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(delimiter);

    if (currentLine.length === headers.length) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j].trim()] = currentLine[j].trim();
      }
      parsedData.push(row);
    }
  }

  return parsedData;
};

/**
 *
 * @param {*} selectedItem
 * @returns
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
 * Returns the csv data & the download link for the file
 * @param {*} jobId Id of analysis submission job, used to help locate s3 file
 * @param {*} fileName Name of the s3 file
 */
export const fetchCSV = async (jobId, fileName) => {
  try {
    let response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );

    const csvText = await axios.get(response.data.url).then((res) => res.data);
    console.log(csvText);
    return {
      data: parseCSV(csvText),
      downloadUrl: response.data.url,
      textUrl: URL.createObjectURL(new Blob([csvText], { type: "text/csv" })),
    };
  } catch (error) {
    console.error("Error fetching csv:", error);
  }
};
