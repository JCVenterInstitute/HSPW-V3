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
 * Parses the csv string
 * @param {string} csvText CSV String
 * @param {string} selectedSection Current section selected by user
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
 * Parses a TSV (Tab-Separated Values) text into an array of objects,
 * where each object represents a row of parsed data. Handles scenarios
 * specific to different selected sections.
 *
 * @param {string} tsvText The TSV text to parse
 * @param {string} selectedSection The selected section to determine parsing logic
 * @returns {Array} An array of objects representing parsed data rows
 */
export const parseTSV = (tsvText, selectedSection) => {
  // Split the TSV text into lines
  const lines = tsvText.split("\n");

  // Determine the delimiter (assuming TSV format)
  const delimiter = "\t";

  // Split the first line to get column headers
  let headers = lines[0].split(delimiter);

  // Clean headers: remove surrounding quotes and handle empty headers
  headers = headers.map((header, index) => {
    // Replace empty headers or headers with 'rn' (potentially corrupted)
    if (
      index === 0 &&
      (header.replace(/['"]+/g, "") === "" ||
        header.replace(/['"]+/g, "") === "rn")
    ) {
      // Special case for Principal Component Analysis
      return selectedSection === "Principal Component Analysis"
        ? "Sample"
        : "Protein";
    } else {
      return header.replace(/['"]+/g, "");
    }
  });

  // Initialize an array to store parsed data rows
  const parsedData = [];

  // Iterate over lines (starting from the second line, skipping headers)
  for (let i = 1; i < lines.length; i++) {
    // Split the current line into columns
    const currentLine = lines[i].split(delimiter);

    // Determine if the section is one requiring special handling for column count
    const isBarSection = [
      "GO Biological Process",
      "GO Molecular Function",
      "GO Cellular Component",
      "KEGG Pathway/Module",
    ].includes(selectedSection);

    // Validate if the current line matches expected column count
    const isValid = isBarSection
      ? currentLine.length === headers.length + 1 // Bar sections have an additional unnamed column
      : currentLine.length === headers.length;

    // If valid, construct an object for the row and push it to parsedData
    if (isValid) {
      const row = {};

      for (let j = 0; j < headers.length; j++) {
        row[headers[j].trim()] = currentLine[j].trim(); // Populate object properties with trimmed values
      }

      // Handle the last column (without a header) if present
      if (currentLine.length === headers.length + 1) {
        row["Unnamed Column"] = currentLine[headers.length].trim();
      }

      parsedData.push(row);
    }
  }

  console.log("> Parsed Data", parsedData);

  // Return the parsed data array
  return parsedData;
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

    return {
      data: parseCSV(csvText),
      downloadUrl: response.data.url,
      textUrl: URL.createObjectURL(new Blob([csvText], { type: "text/csv" })),
    };
  } catch (error) {
    console.error("Error fetching csv:", error);
  }
};

/**
 * Returns the TSV data & the download link for the file
 * @param {string} jobId Id of analysis submission job, used to help locate s3 file
 * @param {string} fileName Name of the s3 file
 * @returns {Object} Object containing parsed TSV data, download URL, and text URL
 */
export const fetchTSV = async (jobId, fileName, selectedSection = null) => {
  try {
    // Fetch the response object containing the URL to download the file
    let response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );

    // Fetch the actual TSV data using the URL obtained from the response
    const tsvText = await axios.get(response.data.url).then((res) => res.data);

    // Parse the TSV data using parseTSV function (assumed to be defined elsewhere)
    const parsedData = parseTSV(tsvText, selectedSection);

    // Return an object with parsed data, download URL, and text URL for Blob
    return {
      data: parsedData,
      downloadUrl: response.data.url,
      textUrl: URL.createObjectURL(new Blob([tsvText], { type: "text/tsv" })),
    };
  } catch (error) {
    console.error("Error fetching TSV:", error);
  }
};

export const fetchData = async (url) => {
  try {
    let csv = await axios.get(url).then((res) => res.data);

    return parseCSV(csv);
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
